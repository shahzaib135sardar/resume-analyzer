import axios from "axios"

const api = axios.create({
  baseURL: "/api",
  timeout: 60000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export async function uploadResume(file: File, jobDescription?: string) {
  const form = new FormData()
  form.append("resume", file)
  if (jobDescription?.trim()) form.append("jobDescription", jobDescription.trim())
  const { data } = await api.post<{ jobId: string }>("/resumes/upload", form)
  return data
}

export async function getJobStatus(jobId: string) {
  const { data } = await api.get(`/resumes/status/${jobId}`)
  return data
}

export async function login(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password })
  return data
}

export async function register(email: string, name: string, password: string) {
  const { data } = await api.post("/auth/register", { email, name, password })
  return data
}

export default api
