import Invoice from "../modules/invoices/invoice.model.js";
import Payment from "../modules/payments/payment.model.js";
import Customer from "../modules/customers/customer.model.js";
import { AppError } from "../utils/AppError.js";
import { generateAIInsight } from "../utils/openai.js";

class AnalyticsService {

  // Revenue analytics
  async getRevenueAnalytics(startDate, endDate, groupBy = 'month') {
    try {
      const matchStage = {
        removed: false,
        paymentStatus: 'paid',
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };

      let groupStage;
      switch (groupBy) {
        case 'day':
          groupStage = {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" }
              },
              revenue: { $sum: "$total" },
              invoiceCount: { $sum: 1 },
              averageInvoice: { $avg: "$total" }
            }
          };
          break;
        case 'week':
          groupStage = {
            $group: {
              _id: {
                year: { $year: "$date" },
                week: { $week: "$date" }
              },
              revenue: { $sum: "$total" },
              invoiceCount: { $sum: 1 },
              averageInvoice: { $avg: "$total" }
            }
          };
          break;
        case 'month':
        default:
          groupStage = {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" }
              },
              revenue: { $sum: "$total" },
              invoiceCount: { $sum: 1 },
              averageInvoice: { $avg: "$total" }
            }
          };
          break;
        case 'year':
          groupStage = {
            $group: {
              _id: { year: { $year: "$date" } },
              revenue: { $sum: "$total" },
              invoiceCount: { $sum: 1 },
              averageInvoice: { $avg: "$total" }
            }
          };
          break;
      }

      const pipeline = [
        { $match: matchStage },
        groupStage,
        { $sort: { "_id": 1 } }
      ];

      const results = await Invoice.aggregate(pipeline);

      // Calculate growth rates
      const revenueData = results.map((item, index) => {
        const growthRate = index > 0 ? 
          ((item.revenue - results[index - 1].revenue) / results[index - 1].revenue * 100) : 0;
        
        return {
          period: item._id,
          revenue: item.revenue,
          invoiceCount: item.invoiceCount,
          averageInvoice: item.averageInvoice,
          growthRate: parseFloat(growthRate.toFixed(2))
        };
      });

      return {
        data: revenueData,
        summary: {
          totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
          totalInvoices: revenueData.reduce((sum, item) => sum + item.invoiceCount, 0),
          averageGrowthRate: revenueData.reduce((sum, item) => sum + item.growthRate, 0) / revenueData.length
        }
      };
    } catch (error) {
      console.error('Failed to get revenue analytics:', error);
      throw error;
    }
  }

  // Customer analytics
  async getCustomerAnalytics() {
    try {
      const pipeline = [
        {
          $match: { removed: false }
        },
        {
          $lookup: {
            from: 'invoices',
            localField: '_id',
            foreignField: 'client',
            as: 'invoices'
          }
        },
        {
          $addFields: {
            totalInvoices: { $size: '$invoices' },
            totalRevenue: {
              $sum: {
                $map: {
                  input: '$invoices',
                  as: 'invoice',
                  in: '$$invoice.total'
                }
              }
            },
            paidInvoices: {
              $size: {
                $filter: {
                  input: '$invoices',
                  as: 'invoice',
                  cond: { $eq: ['$$invoice.paymentStatus', 'paid'] }
                }
              }
            },
            overdueInvoices: {
              $size: {
                $filter: {
                  input: '$invoices',
                  as: 'invoice',
                  cond: {
                    $and: [
                      { $lt: ['$$invoice.expiredDate', new Date()] },
                      { $ne: ['$$invoice.paymentStatus', 'paid'] }
                    ]
                  }
                }
              }
            }
          }
        },
        {
          $addFields: {
            averageInvoiceValue: {
              $cond: {
                if: { $gt: ['$totalInvoices', 0] },
                then: { $divide: ['$totalRevenue', '$totalInvoices'] },
                else: 0
              }
            },
            paymentRate: {
              $cond: {
                if: { $gt: ['$totalInvoices', 0] },
                then: { $multiply: [{ $divide: ['$paidInvoices', '$totalInvoices'] }, 100] },
                else: 0
              }
            }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        }
      ];

      const customerData = await Customer.aggregate(pipeline);

      // Calculate summary statistics
      const summary = {
        totalCustomers: customerData.length,
        activeCustomers: customerData.filter(c => c.totalInvoices > 0).length,
        topCustomers: customerData.slice(0, 10),
        averageCustomerValue: customerData.reduce((sum, c) => sum + c.totalRevenue, 0) / customerData.length,
        averagePaymentRate: customerData.reduce((sum, c) => sum + c.paymentRate, 0) / customerData.length
      };

      return {
        customers: customerData,
        summary
      };
    } catch (error) {
      console.error('Failed to get customer analytics:', error);
      throw error;
    }
  }

  // Payment analytics
  async getPaymentAnalytics(startDate, endDate) {
    try {
      const pipeline = [
        {
          $match: {
            removed: false,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$method',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            averageAmount: { $avg: '$amount' }
          }
        },
        {
          $sort: { totalAmount: -1 }
        }
      ];

      const paymentMethods = await Payment.aggregate(pipeline);

      // Get payment trends over time
      const trendPipeline = [
        {
          $match: {
            removed: false,
            date: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id': 1 }
        }
      ];

      const paymentTrends = await Payment.aggregate(trendPipeline);

      return {
        paymentMethods,
        trends: paymentTrends,
        summary: {
          totalPayments: paymentMethods.reduce((sum, pm) => sum + pm.count, 0),
          totalAmount: paymentMethods.reduce((sum, pm) => sum + pm.totalAmount, 0),
          mostUsedMethod: paymentMethods[0]?._id || 'N/A'
        }
      };
    } catch (error) {
      console.error('Failed to get payment analytics:', error);
      throw error;
    }
  }

  // Invoice status analytics
  async getInvoiceStatusAnalytics() {
    try {
      const pipeline = [
        {
          $match: { removed: false }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ];

      const statusData = await Invoice.aggregate(pipeline);

      const paymentStatusPipeline = [
        {
          $match: { removed: false }
        },
        {
          $group: {
            _id: '$paymentStatus',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ];

      const paymentStatusData = await Invoice.aggregate(paymentStatusPipeline);

      // Get overdue analysis
      const overdueAnalysis = await Invoice.aggregate([
        {
          $match: {
            removed: false,
            expiredDate: { $lt: new Date() },
            paymentStatus: { $ne: 'paid' }
          }
        },
        {
          $addFields: {
            daysOverdue: {
              $divide: [
                { $subtract: [new Date(), '$expiredDate'] },
                1000 * 60 * 60 * 24
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: ['$daysOverdue', 30] }, then: '1-30 days' },
                  { case: { $lte: ['$daysOverdue', 60] }, then: '31-60 days' },
                  { case: { $lte: ['$daysOverdue', 90] }, then: '61-90 days' }
                ],
                default: '90+ days'
              }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' }
          }
        }
      ]);

      return {
        invoiceStatus: statusData,
        paymentStatus: paymentStatusData,
        overdueAnalysis,
        summary: {
          totalInvoices: statusData.reduce((sum, s) => sum + s.count, 0),
          totalValue: statusData.reduce((sum, s) => sum + s.totalAmount, 0),
          overdueCount: overdueAnalysis.reduce((sum, o) => sum + o.count, 0),
          overdueValue: overdueAnalysis.reduce((sum, o) => sum + o.totalAmount, 0)
        }
      };
    } catch (error) {
      console.error('Failed to get invoice status analytics:', error);
      throw error;
    }
  }

  // Comprehensive business intelligence report
  async getBusinessIntelligenceReport(startDate, endDate) {
    try {
      const [
        revenueAnalytics,
        customerAnalytics,
        paymentAnalytics,
        statusAnalytics
      ] = await Promise.all([
        this.getRevenueAnalytics(startDate, endDate),
        this.getCustomerAnalytics(),
        this.getPaymentAnalytics(startDate, endDate),
        this.getInvoiceStatusAnalytics()
      ]);

      // Generate AI insights for the business intelligence report
      const reportData = {
        revenue: revenueAnalytics.summary,
        customers: customerAnalytics.summary,
        payments: paymentAnalytics.summary,
        invoices: statusAnalytics.summary
      };

      const aiInsights = await generateAIInsight(
        `Business Intelligence Report Analysis:
        Revenue: Total ${reportData.revenue.totalRevenue} from ${reportData.revenue.totalInvoices} invoices
        Customers: ${reportData.customers.totalCustomers} total, ${reportData.customers.activeCustomers} active
        Payments: ${reportData.payments.totalPayments} payments totaling ${reportData.payments.totalAmount}
        Overdue: ${reportData.invoices.overdueCount} invoices worth ${reportData.invoices.overdueValue}
        
        Provide strategic business insights, identify trends, risks, and opportunities for growth.`
      );

      return {
        period: { startDate, endDate },
        revenue: revenueAnalytics,
        customers: customerAnalytics,
        payments: paymentAnalytics,
        invoiceStatus: statusAnalytics,
        aiInsights,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Failed to generate business intelligence report:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();
