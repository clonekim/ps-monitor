import axios from 'axios';
import { useLoading, useProcess, useAlert } from '../store';

function useApi() {
  const { setLoading } = useLoading();
  const { setList } = useProcess();
  const { setAlert } = useAlert();

  const psCommand = () => {
    setLoading(true);
    axios
      .get('/ps')
      .then(res => setList(res.data || []))
      .catch(err => {
        setAlert({ text: err.message, type: 'error' });
      })
      .finally(() => setLoading(false));
  };

  const logCommand = () => {};

  const configCommand = async () => {
    try {
      const { data } = await axios.get('/config');
      return data;
    } catch (err) {
      setAlert({ text: err.message, type: 'error' });
    }
  };

  return {
    psCommand,
  };
}

export default useApi;
