export async function getDashboardStats(
  token: string,
) {
  const response = await fetch(
    "/api/dashboard/stats",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch dashboard stats",
    );
  }

  return data;
}

export async function getSalesAnalytics(
  token: string,
) {
  const response = await fetch(
    "/api/dashboard/analytics",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch sales analytics",
    );
  }

  return data;
}