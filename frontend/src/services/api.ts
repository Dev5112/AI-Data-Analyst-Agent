import axios from 'axios';

export interface AnalysisResponse {
  [question: string]: any;
}

export const analyzeData = async (
  questionsFile: File,
  dataFile: File | null
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('questions_file', questionsFile);
  if (dataFile) {
    formData.append('data_file', dataFile);
  }

  const response = await axios.post('/api', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
