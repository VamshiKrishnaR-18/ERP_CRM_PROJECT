import { generateAIInsight  } from "../../utils/openai.js";

//helper
export const calculateTotals = (items = [], taxRate = 0, discount = 0, credit = 0) => {
  let subTotal = 0;
  items.forEach((item) => {
    const itemTotal = item.quantity * item.price;
    subTotal += itemTotal;
    item.total = itemTotal;
  });

  const taxTotal = (subTotal * taxRate) / 100;

  const total = subTotal + taxTotal - discount - credit;

  return { subTotal, taxTotal, total };
};


//helper
