import axiosInstance from "./axiosInstance";

export const getDashboardData = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData");

    if (res.data?.isSuccess && res.data.result) {
      return {
        allDoctors: res.data.result.allDoctors || [],
        randomDoctors: res.data.result.randomDoctorsFullData || [],
        articles: res.data.result.randomArticles || [],
        userStats: {
          activeCount: res.data.result.activeUserCount || 0,
          activePercentage: res.data.result.activeUsersLastWeekPercentage || 0,
          doctorCount: res.data.result.totalDoctors || 0,
          doctorPercentage: res.data.result.doctorsLastWeekPercentage || 0,
        },
        predictionStats: res.data.result.predictionStats || [],
        aiResult: res.data.result.aiResult || [],
      };
    }

    console.error("Invalid dashboard data structure");
    return {
      allDoctors: [],
      randomDoctors: [],
      articles: [],
      userStats: {
        activeCount: 0,
        activePercentage: 0,
      },
      predictionStats: [],
      aiResult: [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to load dashboard data. Please try again later."
    );
  }
};
