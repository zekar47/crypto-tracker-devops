# Crypto Tracker DevOps v2.0 🚀

### Descripción del proyecto
Una solución integral de monitoreo de criptomonedas diseñada bajo principios DevOps. La aplicación permite consultar precios en tiempo real (vía CoinGecko API), persistir el historial en MongoDB y automatizar la infraestructura mediante AWS CloudFormation.

### Arquitectura
El sistema utiliza una arquitectura de microservicios contenerizados:
* **Frontend:** Interfaz reactiva en Vue.js servida por Nginx.
* **Backend:** API REST en Node.js con lógica de *Circuit Breaker* y *Cache*.
* **Database:** MongoDB 4.4 para persistencia de datos.
* **Infrastructure:** AWS EC2, S3 (backups) e IAM Roles.

### Tecnologías utilizadas
* **Core:** Node.js, Express, Vue.js 3, Bulma CSS.
* **DevOps:** Docker, Docker Compose, AWS CloudFormation, GitHub Actions.
* **Monitorización:** AWS S3 (Logs), Cloud-init.

### Instrucciones de ejecución local
1. Asegúrate de tener instalado **Docker** y **Docker Compose**.
2. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/crypto-tracker-devops.git
   ```
3. Inicia los servicios:
   ```bash
   docker compose up --build
   ```
4. Accede a `http://localhost:8080` para el frontend y `http://localhost:3000` para la API.

### Instrucciones de despliegue en EC2
1. Sube tu plantilla de CloudFormation a la consola de AWS o usa el CLI:
   ```bash
   aws cloudformation create-stack --stack-name CryptoStack --template-body file://cloudformation/template.yaml
   ```
2. La infraestructura se provisionará automáticamente, instalando Docker y configurando el despliegue mediante el `UserData`.

### Puertos utilizados
| Servicio | Puerto | Uso |
| :--- | :--- | :--- |
| **Frontend** | 8080 | Interfaz de usuario |
| **Backend** | 3000 | API REST |
| **MongoDB** | 27017 | Base de datos |
| **SSH** | 22 | Administración remota |

---
