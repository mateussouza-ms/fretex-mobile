import axios from "axios";

const apiCorreios = axios.create({
  baseURL:
    "https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente",
});

export default apiCorreios;
