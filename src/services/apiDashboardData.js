import axiosInstance from "./axiosInstance"

export const getDashboardData = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData")

    if (res.data?.isSuccess && res.data.result) {
      return {
        allDoctors: res.data.result.allDoctors || [],
        randomDoctors: res.data.result.randomDoctorsFullData || [],
        articles: res.data.result.randomArticles || [],
        userStats: {
          activeCount: res.data.result.activeUserCount || 0,
          activePercentage: res.data.result.activeUsersLastWeekPercentage || 0,
        },
        predictionStats: res.data.result.predictionStats || [],
        aiResult: res.data.result.aiResult || [],
      }
    }

    console.error("Invalid dashboard data structure")
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
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw new Error(error.response?.data?.message || "Failed to load dashboard data. Please try again later.")
  }
}

export const getDashboardDoctors = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData")

    if (res.data?.isSuccess && Array.isArray(res.data.result?.allDoctors)) {
      return res.data.result.allDoctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        imageDoctor: doctor.imageDoctor,
        latitude: doctor.latitude,
        longitude: doctor.longitude,
        numOfPatients: doctor.numOfPatients,
        about: doctor.about,
        location: doctor.location,
        experianceYears: doctor.experianceYears,
        phone: doctor.phone,
        teliphone: doctor.teliphone,
        category: doctor.category,
      }))
    }

    console.error("No doctors found in dashboard data")
    return []
  } catch (error) {
    console.error("Error fetching dashboard doctors:", error)
    throw new Error(error.response?.data?.message || "Failed to load doctors data. Please try again later.")
  }
}

export const getDashboardArticles = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData")

    if (res.data?.isSuccess && Array.isArray(res.data.result?.randomArticles)) {
      return res.data.result.randomArticles.map((article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        coverImage: article.coverImage,
        categoryId: article.categoryId,
      }))
    }

    console.error("No articles found in dashboard data")
    return []
  } catch (error) {
    console.error("Error fetching dashboard articles:", error)
    throw new Error(error.response?.data?.message || "Failed to load articles. Please try again later.")
  }
}

export const getPredictionStats = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData")

    if (res.data?.isSuccess && Array.isArray(res.data.result?.predictionStats)) {
      return res.data.result.predictionStats.map((stat) => ({
        result: stat.result,
        count: stat.count,
        weeklyCount: stat.weeklyCount,
        weeklyPercentage: stat.weeklyPercentage,
      }))
    }

    console.error("No prediction stats found in dashboard data")
    return []
  } catch (error) {
    console.error("Error fetching prediction stats:", error)
    throw new Error(error.response?.data?.message || "Failed to load prediction statistics. Please try again later.")
  }
}

export const getUserStats = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData")

    if (res.data?.isSuccess && res.data.result) {
      return {
        activeCount: res.data.result.activeUserCount || 0,
        activePercentage: res.data.result.activeUsersLastWeekPercentage || 0,
      }
    }

    console.error("No user stats found in dashboard data")
    return {
      activeCount: 0,
      activePercentage: 0,
    }
  } catch (error) {
    console.error("Error fetching user stats:", error)
    throw new Error(error.response?.data?.message || "Failed to load user statistics. Please try again later.")
  }
}
export const getAIResults = async () => {
  try {
    const res = await axiosInstance.get("/Dashboard/GetDashboardData");

    if (res.data?.isSuccess && Array.isArray(res.data.result?.aiResult)) {
      return res.data.result.aiResult.map((item) => ({
        user: item.user,
        createdAt: item.createdAt,
        result: item.result,
        status: item.status,
      }));
    }

    console.error("No AI results found in dashboard data");
    return [];
  } catch (error) {
    console.error("Error fetching AI results:", error);
    throw new Error(error.response?.data?.message || "Failed to load AI results. Please try again later.");
  }
};
