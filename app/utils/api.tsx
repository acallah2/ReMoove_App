import axios from "axios";

export const API_ENDPOINTS = {
  manualControls:
    "https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/ManualControls",
  status: "https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/status",
  home: "https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/Home",
  chart: "https://m4t7u6yuzg.execute-api.us-east-2.amazonaws.com/Dev/TrashCount",
  // Add other endpoints if needed
};

/**
 * Fetches the list of trashcans for the home screen.
 * @returns A list of trashcan entries.
 */
export const fetchHomeTrashCans = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.home);
    console.log("Fetched home trashcans:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching home trashcans:", error);
    throw new Error("Failed to fetch home trashcans");
  }
};

/**
 * Fetches the current status for a trash can.
 * @param trashCanId - The ID of the trash can to fetch status for.
 * @returns The trash can status data.
 */
export const fetchTrashCanStatus = async (trashCanId: string) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.status}/${trashCanId}`);
    console.log("Fetched trash can status:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching trash can status:", error);
    throw new Error("Failed to fetch trash can status");
  }
};

/**
 * Sends a manual control command to the API.
 * @param command - The control command to send (forceSort, openTrap, moveGantry).
 */
export const sendManualControl = async (command: object) => {
  try {
    const response = await axios.post(API_ENDPOINTS.manualControls, command, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sending manual control:", error);
    return {
      error: "Failed to send command",
      details: error?.response?.data || error.message,
    };
  }
};

/**
 * Connects to the trash can WebSocket and registers a callback for incoming messages.
 * @param trashCanId - The ID of the trash can to subscribe to.
 * @param onMessage - Callback to handle incoming messages.
 * @returns The WebSocket instance.
 */
export const connectTrashCan = (
  trashCanId: string,
  onMessage: (data: any) => void
) => {
  const ws = new WebSocket("wss://nj24w2285l.execute-api.us-east-2.amazonaws.com/dev/"); // Replace with your WS endpoint

  ws.onopen = () => {
    console.log("WebSocket connected");
    // Optional: send subscription message if your API requires it
    // ws.send(JSON.stringify({ subscribe: trashCanId }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // Only process messages for the expected trash can.
      if (data.trashCanId === trashCanId) {
        onMessage(data);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
  };

  return ws;
};

/**
 * Fetches chart data for a specific trash can.
 * @param trashCanId - The ID of the trash can to fetch chart data for.
 * @returns The chart data containing counts for different time ranges.
 */
export const fetchChartData = async (trashCanId: string) => {
  console.log("Sending request to:", API_ENDPOINTS.chart);
  console.log("With payload:", { trashCanId });
  
  try {
    const response = await axios.post(
      API_ENDPOINTS.chart, 
      { trashCanId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    // Handle both direct response and Lambda proxy response formats
    const data = response.data.body ? JSON.parse(response.data.body) : response.data;
    console.log("Chart data response:", data);
    return data;
  } catch (error: any) {
    // Log the full error details
    console.error("Chart data fetch error details:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      headers: error.response?.headers
    });
    
    throw new Error(error.response?.data?.message || "Failed to fetch chart data");
  }
};