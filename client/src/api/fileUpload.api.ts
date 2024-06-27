import api from './axiosInstance';

export const uploadFileToServer = async (formData: FormData): Promise<{ url: string, public_id: string }> => {
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;  // return both url and public_id
};
