import { environmentService } from '@infraestructure/EnvironmentService';
import api from './api';

environmentService.load();

const PORT = environmentService.get().PORT;

api.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
