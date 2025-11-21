# Índices Compostos do Firestore para XPs

Este documento lista os índices compostos necessários para as queries de filtragem de XPs no Firestore.

## Collection: `xps`

### Índice 1: ownerId + createdAt (range) + orderBy

**Uso**: Queries com filtro de ownerId e range de datas, ordenadas por createdAt.

**Campos**:

- `ownerId` (Ascending)
- `createdAt` (Descending)

**Query exemplo**:

```javascript
where("ownerId", "==", ownerId);
where("createdAt", ">=", startDate);
where("createdAt", "<=", endDate);
orderBy("createdAt", "desc");
```

---

### Índice 2: ownerId + tags (array) + orderBy

**Uso**: Queries com filtro de ownerId e categorias (tags), ordenadas por createdAt.

**Campos**:

- `ownerId` (Ascending)
- `tags` (Arrays)
- `createdAt` (Descending)

**Query exemplo**:

```javascript
where("ownerId", "==", ownerId);
where("tags", "array-contains-any", categoryTitles);
orderBy("createdAt", "desc");
```

---

### Índice 3: ownerId + createdAt (range) + tags (array) + orderBy

**Uso**: Queries com filtro de ownerId, range de datas e categorias, ordenadas por createdAt.

**Campos**:

- `ownerId` (Ascending)
- `createdAt` (Descending)
- `tags` (Arrays)

**Query exemplo**:

```javascript
where("ownerId", "==", ownerId);
where("createdAt", ">=", startDate);
where("createdAt", "<=", endDate);
where("tags", "array-contains-any", categoryTitles);
orderBy("createdAt", "desc");
```

---

## Como criar os índices

### Opção 1: Automático (recomendado para desenvolvimento)

O Firestore criará automaticamente os índices quando você executar uma query que precise deles. Você verá um link no console do navegador ou nos logs do Firebase que permite criar o índice com um clique.

### Opção 2: Manual (recomendado para produção)

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database** > **Indexes**
4. Clique em **Add Index**
5. Configure cada índice conforme especificado acima

### Opção 3: Via arquivo `firestore.indexes.json`

Crie ou atualize o arquivo `firestore.indexes.json` na raiz do projeto:

```json
{
  "indexes": [
    {
      "collectionGroup": "xps",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ownerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "xps",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ownerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "tags",
          "arrayConfig": "CONTAINS"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "xps",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ownerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        },
        {
          "fieldPath": "tags",
          "arrayConfig": "CONTAINS"
        }
      ]
    }
  ]
}
```

Depois, execute:

```bash
firebase deploy --only firestore:indexes
```

## Notas importantes

1. **Formato de `createdAt`**: Atualmente armazenado como string ISO (`toISOString()`). Strings ISO são comparáveis lexicograficamente, então as queries de range funcionam corretamente. Para melhor performance, considere migrar para `Timestamp` do Firestore no futuro.

2. **Limitações do Firestore**:

   - `array-contains-any` só pode ser usado uma vez por query
   - Para combinar range queries com `array-contains-any`, é necessário um índice composto específico
   - A ordem dos campos no índice deve corresponder à ordem na query

3. **Performance**: Com os índices corretos, as queries serão executadas diretamente no Firestore, trazendo apenas os dados filtrados, melhorando performance e reduzindo custos de leitura.
