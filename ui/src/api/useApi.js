import axios from 'axios';
import { useLoading, useProcess, useAlert } from '../store';

function useApi() {
  const { setLoading } = useLoading();
  const { content, setContent, setList } = useProcess();
  const { setAlert } = useAlert();

  const psCommand = () => {
    setLoading(true);
    axios
      .get('/ps')
      .then(res => {
        const list = res.data || [];
        setList(list);

        if (content && content.label) {
          list.forEach(i => {
            if (i.label === content.label) setContent(i);
          });
        }
      })
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
    configCommand,
    logCommand,
  };
}

export default useApi;
