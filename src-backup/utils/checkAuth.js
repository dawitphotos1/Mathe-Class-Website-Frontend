
import axios from "./api";

export async function checkAuth() {
  try {
    const res = await axios.get("/auth/me");
    return res.data; // should return user info if authenticated
  } catch (err) {
    return null;
  }
}
