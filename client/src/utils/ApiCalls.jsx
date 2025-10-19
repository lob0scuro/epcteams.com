export const handleDelete = async (endpoint, id, { inputs } = {}) => {
  try {
    const options = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (inputs) {
      options.body = JSON.stringify(inputs);
    }
    const response = await fetch(`/api/delete/${endpoint}/${id}`, options);
    const data = await response.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Something went wrong",
      };
    }
    return { success: true, message: data.message, return_value: data.data };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
};
