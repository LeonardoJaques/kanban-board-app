// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const boardStyle =
`/* per-board customized styles */
/*
.KanbanBoardView-sticky-note {width: 200px}
.KanbanBoardView-header-cell-task-statuses {min-width: 210px}
table.KanbanBoardView-board tbody th {
    padding: 10px;
    white-space: nowrap;
}
*/
table.KanbanBoardView-board thead th.status-backlog {
    background-color: var(--weak-header-bg-color);
}
table.KanbanBoardView-board td.status-backlog {
    background-color: var(--weak-data-bg-color);
}
table.KanbanBoardView-board thead th.status-done {
    background-color: var(--weak-header-bg-color);
}
table.KanbanBoardView-board td.status-done {
    background-color: var(--weak-data-bg-color);
}
.status-done .KanbanBoardView-sticky-note {
    background-color: var(--sticky-green-color);
}
.KanbanBoardView-sticky-tags .tag-bug {
    color: white;
    background-color: red;
}
.KanbanBoardView-sticky-tags .tag-ok {
    color: white;
    background-color: green;
}
.KanbanBoardView-sticky-tags .tag-NG {
    color: white;
    background-color: #e91e63;
}
.KanbanBoardView-sticky-tags .tag-PR {
    color: white;
    background-color: purple;
}
.KanbanBoardView-sticky-tags .tag-rejected {
    color: white;
    background-color: #990000;
}
.KanbanBoardView-sticky-tags .tag-pending {
    color: black;
    background-color: #ff9900;
}
.KanbanBoardView-sticky-tags .tag-merged {
    color: white;
    background-color: #006666;
}
.KanbanBoardView-sticky-tags .tag-critical {
    color: white;
    background-color: red;
}
.KanbanBoardView-sticky-tags .tag-high {
    color: white;
    background-color: #ff5522;
}
.KanbanBoardView-sticky-tags .tag-moderate {
    color: black;
    background-color: #ffcc00;
}
.KanbanBoardView-sticky-tags .tag-low {
    color: black;
    background-color: #cc9900;
}
.KanbanBoardView-sticky-tags .tag-star {
    color: inherit;
    background-color: inherit;
}
`;


export const calendarStyle =
`/* per-board customized styles */
div.CalendarView-item-chip.status-done {
    background-color: var(--sticky-green-color);
}
`;


export const boardNote =
`# This is a board note.
* Markdown syntax is available.
* Go [Editor](#/edit/) to edit this note.`;


export const initialData = {
    "boards": [{
        "type": "kanbanBoard",
        "name": "Welcome Board",
        "taskStatuses": [{
            "value": "Backlog",
            "caption": "🛌 Backlog",
            "className": "status-backlog"
        }, {
            "value": "ToDo",
            "caption": "📯 ToDo",
            "className": "status-todo"
        }, {
            "value": "InProgress",
            "caption": "⛏ InProgress",
            "className": "status-inprogress"
        }, {
            "value": "Staging",
            "caption": "📦 Staging",
            "className": "status-staging"
        }, {
            "value": "Done",
            "caption": "🎉 Done",
            "className": "status-done",
            "completed": true
        }],
        "teamOrStories": [{
            "value": "Backend",
            "caption": "⚙️ Backend",
            "className": "epic-backend"
        }, {
            "value": "Frontend",
            "caption": "🖥️ Frontend",
            "className": "epic-frontend"
        }, {
            "value": "DevOps",
            "caption": "🚀 DevOps",
            "className": "epic-devops"
        }, {
            "value": "Docs",
            "caption": "📄 Docs",
            "className": "epic-docs"
        }],
        "tags": [{
            "value": "bug",
            "className": "tag-bug"
        }, {
            "value": "ok",
            "className": "tag-ok"
        }, {
            "value": "NG",
            "className": "tag-NG"
        }, {
            "value": "PR",
            "className": "tag-PR"
        }, {
            "value": "rejected",
            "className": "tag-rejected"
        }, {
            "value": "pending",
            "className": "tag-pending"
        }, {
            "value": "merged",
            "className": "tag-merged"
        }, {
            "value": "critical",
            "className": "tag-critical"
        }, {
            "value": "high",
            "className": "tag-high"
        }, {
            "value": "moderate",
            "className": "tag-moderate"
        }, {
            "value": "low",
            "className": "tag-low"
        }, {
            "value": "⭐",
            "className": "tag-star"
        }, {
            "value": "⭐⭐",
            "className": "tag-star"
        }, {
            "value": "⭐⭐⭐",
            "className": "tag-star"
        }],
        "displayBarcode": true,
        "displayMemo": true,
        "displayFlags": true,
        "displayTags": true,
        "preferArchive": false,
        "boardStyle": boardStyle,
        "calendarStyle": calendarStyle,
        "boardNote": "",
    }],
    "records": [{
        "type": "kanban",
        "dueDate": "",
        "description": "# Configurar banco de dados\n* Criar schema com Prisma\n* Definir migrations iniciais",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["high"],
        "boardId": "",
        "teamOrStory": "Backend",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Implementar API REST\n* Endpoints CRUD\n* Autenticação com sessão",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["high"],
        "boardId": "",
        "teamOrStory": "Backend",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Rate limiting\nAdicionar limitação de requisições por IP no Express",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["moderate"],
        "boardId": "",
        "teamOrStory": "Backend",
        "taskStatus": "InProgress"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Testes de integração\nCobertura dos endpoints principais com Jest",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["low"],
        "boardId": "",
        "teamOrStory": "Backend",
        "taskStatus": "Backlog"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Modernizar visual\n* Nova paleta de cores (zinc + violet)\n* Cards com border-radius e stripe de status",
        "barcode": "",
        "memo": "",
        "flags": ["Marked"],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "Frontend",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Otimizações de performance\n* `React.memo` nos cards\n* `useMemo` no markdown parser\n* Code splitting por rota",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "Frontend",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Swim lanes por épico\nSubstituir Team A/B/C por Backend, Frontend, DevOps, Docs",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "Frontend",
        "taskStatus": "InProgress"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Contador de cards por coluna\nBadge numérico no header de cada status",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "Frontend",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Docker Compose\nStack completa: Traefik + app + PostgreSQL",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "DevOps",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Pipeline Jenkins\nBuild, testes e deploy automático no VPS",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "DevOps",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Backup automático\nScript diário com retenção de 7 dias",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["moderate"],
        "boardId": "",
        "teamOrStory": "DevOps",
        "taskStatus": "InProgress"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Upgrade Ubuntu 20.04 → 22.04\nEOL desde abril/2025",
        "barcode": "",
        "memo": "",
        "flags": ["Marked"],
        "tags": ["critical"],
        "boardId": "",
        "teamOrStory": "DevOps",
        "taskStatus": "Backlog"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Atualizar README\n* Screenshot do novo layout\n* Tabela de tecnologias",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["ok"],
        "boardId": "",
        "teamOrStory": "Docs",
        "taskStatus": "Done"
    }, {
        "type": "kanban",
        "dueDate": "",
        "description": "# Documentar API REST\nEndpoints, parâmetros e exemplos de resposta",
        "barcode": "",
        "memo": "",
        "flags": [],
        "tags": ["low"],
        "boardId": "",
        "teamOrStory": "Docs",
        "taskStatus": "Backlog"
    }]
}
