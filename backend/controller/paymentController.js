import Payment from "../models/paymentModel.js";

export const getTotalRevenue = async (req, res) => {
  try {
    // Aggregate only successful payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: "success" } }, // only completed payments
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" }, // sum all amounts
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    return res.status(200).json({
      success: true,
      message: "Total revenue from successful payments fetched",
      data: {
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Total revenue error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};