import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const invoiceSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    content: String,

    recurring: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },

    isRecurringTemplate: {
      type: Boolean,
      default: false,
    },

    recurringTemplate: {
      type: mongoose.Schema.ObjectId,
      ref: "Invoice",
    },

    lastRecurringGenerated: {
      type: Date,
    },

    nextRecurringDate: {
      type: Date,
    },

    date: {
      type: Date,
      required: true,
    },

    expiredDate: {
      type: Date,
      required: true,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Customer",
      required: true,
      autopopulate: true,
    },
    converted: {
      from: {
        type: String,
        enum: ["quote", "offer"],
      },

      offer: {
        type: mongoose.Schema.ObjectId,
        ref: "Offer",
      },
      quote: {
        type: mongoose.Schema.ObjectId,
        ref: "Quote",
      },
    },

    items: [
      {
        

        itemName: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },

        discount: {
          type: Number,
          default: 0,
        },

        taxRate: {
          type: Number,
          default: 0,
        },
        subTotal: {
          type: Number,
          default: 0,
        },
        taxTotal: {
          type: Number,
          default: 0,
        },
      },
    ],

    taxRate: {
      type: Number,
      default: 0,
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    taxTotal: {
      type: Number,
      default: 0,
    },

    total: { type: Number, default: 0 },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      required: true,
    },
    credit: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },

    payment:[{
        type:mongoose.Schema.ObjectId,
        ref:"Payment",
        autopopulate:true,
    }],

    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid", "partial"],
      default: "unpaid",
    },

    isOverdue: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },

    notes: String,
    status: {
      type: String,
      enum: ["draft", "pending", "sent", "refunded", "cancelled", "on hold"],
      default: "draft",
    },

    pdf: String,

    files: [
      {
        id: String,
        name: String,
        path: String,
        description: String,
        isPublic: {
          type: Boolean,
          default: false,
        },
      },
    ],
    updated: { type: Date, default: Date.now() },
    created: {
      type: Date,
      default: Date.now(),
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

invoiceSchema.virtual("overdue").get(function () {
  return this.expiredDate < new Date() && this.paymentStatus !== "paid";
});

invoiceSchema.plugin(autopopulate);

export default mongoose.model("Invoice", invoiceSchema);
