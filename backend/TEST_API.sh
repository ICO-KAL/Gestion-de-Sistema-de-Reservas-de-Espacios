#!/bin/bash
# SpaceBooker API - Ejemplos de Uso
# Ejecutar estos comandos para probar la API

BASE_URL="http://localhost:5000/api/v1"

echo "=========================================="
echo "SpaceBooker API - Testing Guide"
echo "=========================================="
echo ""

# ==================== AUTENTICACIÓN ====================
echo "1️⃣  REGISTRO DE USUARIO"
echo "POST /auth/register"
echo ""

curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'

echo -e "\n\n"

# ==================== LOGIN ====================
echo "2️⃣  INICIAR SESIÓN"
echo "POST /auth/login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE"

# Extraer token (si usas jq)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo -e "\n\n"

# ==================== VER PERFIL ====================
echo "3️⃣  VER PERFIL"
echo "GET /auth/profile"
echo "Authorization: Bearer $TOKEN"
echo ""

curl -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# ==================== CREAR ESPACIO (ADMIN) ====================
echo "4️⃣  CREAR ESPACIO (REQUIERE ROL ADMIN)"
echo "POST /espacios"
echo ""

curl -X POST "$BASE_URL/espacios" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nombre": "Aula 101",
    "descripcion": "Aula para 30 personas",
    "capacidad_maxima": 30
  }'

echo -e "\n\n"

# ==================== LISTAR ESPACIOS ====================
echo "5️⃣  LISTAR TODOS LOS ESPACIOS"
echo "GET /espacios"
echo ""

curl -X GET "$BASE_URL/espacios"

echo -e "\n\n"

# ==================== CONSULTAR DISPONIBILIDAD ====================
echo "6️⃣  CONSULTAR DISPONIBILIDAD"
echo "GET /reservas/disponibilidad"
echo ""

curl -X GET "$BASE_URL/reservas/disponibilidad?id_espacio=1&fecha_inicio=2025-01-20T10:00:00&fecha_fin=2025-01-20T11:00:00"

echo -e "\n\n"

# ==================== CREAR RESERVA ====================
echo "7️⃣  CREAR RESERVA"
echo "POST /reservas"
echo ""

curl -X POST "$BASE_URL/reservas" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id_espacio": 1,
    "fecha_inicio": "2025-01-20T10:00:00",
    "fecha_fin": "2025-01-20T11:00:00",
    "descripcion_uso": "Reunión de equipo"
  }'

echo -e "\n\n"

# ==================== VER MIS RESERVAS ====================
echo "8️⃣  VER MIS RESERVAS"
echo "GET /reservas/mis_reservas"
echo ""

curl -X GET "$BASE_URL/reservas/mis_reservas" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n"

# ==================== STATUS DEL SERVIDOR ====================
echo "9️⃣  STATUS DEL SERVIDOR"
echo "GET /status"
echo ""

curl -X GET "http://localhost:5000/api/status"

echo -e "\n\n=========================================="
echo "✅ Testing completado"
echo "=========================================="
