import { useState, useEffect } from "react";
import {
  getUserHistory,
  getAllHistory,
  deleteHistory,
} from "../../services/apiHistory";

export const useModelHistory = (userId = null) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const data = userId ? await getUserHistory(userId) : await getAllHistory();
    setHistory(data);
    setLoading(false);
  };

  const removeHistory = async (id) => {
    await deleteHistory(id);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading, fetchHistory, removeHistory };
};
