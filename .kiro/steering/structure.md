# AutoClip Project Structure

## Root Directory Layout

```
autoclip/
├── backend/                 # Python backend application
├── frontend/                # React frontend application
├── data/                    # Runtime data storage
├── scripts/                 # Utility and setup scripts
├── docs/                    # Project documentation
├── prompt/                  # AI prompt templates
├── logs/                    # Application logs
├── .kiro/                   # Kiro IDE configuration
├── .trae/                   # Project documentation
└── *.sh                     # Shell scripts for deployment
```

## Backend Structure (`backend/`)

```
backend/
├── api/                     # API route handlers
│   ├── v1/                 # API version 1 endpoints
│   │   ├── youtube.py      # YouTube download API
│   │   ├── bilibili.py     # Bilibili download API
│   │   ├── projects.py     # Project management API
│   │   ├── clips.py        # Video clips API
│   │   ├── collections.py  # Collections API
│   │   └── settings.py     # System settings API
│   └── upload_queue.py     # Upload queue management
├── core/                   # Core system components
│   ├── config.py          # Configuration management
│   ├── database.py        # Database setup
│   ├── celery_app.py      # Celery configuration
│   └── websocket_manager.py # WebSocket handling
├── models/                 # SQLAlchemy data models
│   ├── project.py         # Project model
│   ├── clip.py            # Clip model
│   ├── collection.py      # Collection model
│   └── bilibili.py        # Bilibili account model
├── services/               # Business logic layer
│   ├── processing_service.py # Video processing
│   ├── project_service.py    # Project management
│   └── upload_service.py     # Upload handling
├── tasks/                  # Celery background tasks
│   ├── processing.py      # Processing tasks
│   ├── upload.py          # Upload tasks
│   └── maintenance.py     # System maintenance
├── pipeline/               # AI processing pipeline
│   ├── step1_outline.py   # Content outline extraction
│   ├── step2_timeline.py  # Timeline analysis
│   ├── step3_scoring.py   # Highlight scoring
│   ├── step4_title.py     # Title generation
│   ├── step5_clustering.py # Topic clustering
│   └── step6_video.py     # Video generation
├── utils/                  # Utility functions
│   ├── video_processor.py # Video processing utilities
│   ├── llm_client.py      # LLM API client
│   └── thumbnail_generator.py # Thumbnail generation
├── repositories/           # Data access layer
├── schemas/               # Pydantic schemas
└── tests/                 # Test files
```

## Frontend Structure (`frontend/`)

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── UploadModal.tsx      # File upload modal
│   │   ├── ClipCard.tsx         # Video clip card
│   │   ├── CollectionCard.tsx   # Collection card
│   │   ├── BilibiliManager.tsx  # Bilibili account management
│   │   └── ProjectCard.tsx      # Project card
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx         # Main dashboard
│   │   ├── ProjectDetailPage.tsx # Project details
│   │   └── SettingsPage.tsx     # System settings
│   ├── services/          # API service layer
│   │   └── api.ts              # API client
│   ├── stores/            # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Frontend utilities
│   └── hooks/             # Custom React hooks
├── public/                # Static assets
└── package.json          # Dependencies and scripts
```

## Data Directory (`data/`)

```
data/
├── projects/              # Project-specific data
│   └── {project-id}/     # Individual project folders
│       ├── raw/          # Original uploaded files
│       ├── output/       # Generated clips and collections
│       └── metadata/     # Project metadata and analysis
├── uploads/              # Temporary upload storage
├── temp/                 # Temporary processing files
└── autoclip.db          # SQLite database file
```

## Key Configuration Files

- **`.env`**: Environment variables (copy from `env.example`)
- **`requirements.txt`**: Python dependencies
- **`frontend/package.json`**: Node.js dependencies
- **`docker-compose.yml`**: Production Docker configuration
- **`docker-compose.dev.yml`**: Development Docker configuration

## Prompt Templates (`prompt/`)

AI prompt templates organized by content category:
- `business/` - Business content prompts
- `entertainment/` - Entertainment content prompts
- `knowledge/` - Educational content prompts
- `opinion/` - Opinion/commentary prompts
- `speech/` - Speech/lecture prompts

Each category contains:
- `大纲.txt` - Outline extraction prompts
- `时间点.txt` - Timeline analysis prompts
- `推荐理由.txt` - Scoring prompts
- `标题生成.txt` - Title generation prompts
- `主题聚类.txt` - Topic clustering prompts

## Scripts Directory (`scripts/`)

Utility scripts for setup and maintenance:
- `start_backend.py` - Backend startup script
- `install_bcut_asr.py` - Speech recognition setup
- `migrate_config.py` - Configuration migration
- `data_consistency_check.py` - Data validation

## Naming Conventions

### Python (Backend)
- **Files**: snake_case (e.g., `video_processor.py`)
- **Classes**: PascalCase (e.g., `VideoProcessor`)
- **Functions/Variables**: snake_case (e.g., `process_video`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### TypeScript (Frontend)
- **Files**: PascalCase for components (e.g., `ClipCard.tsx`)
- **Files**: camelCase for utilities (e.g., `apiClient.ts`)
- **Components**: PascalCase (e.g., `ClipCard`)
- **Functions/Variables**: camelCase (e.g., `processVideo`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

## Import Patterns

### Backend Imports
```python
# Relative imports within backend
from .core.config import settings
from .models.project import Project
from .services.processing_service import ProcessingService

# External imports
from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
```

### Frontend Imports
```typescript
// React and libraries
import React from 'react';
import { Button, Modal } from 'antd';

// Internal components and utilities
import ClipCard from '../components/ClipCard';
import { apiClient } from '../services/api';
import { useProjectStore } from '../stores/projectStore';
```

## File Organization Principles

1. **Separation of Concerns**: Clear separation between API, business logic, and data layers
2. **Feature-based Grouping**: Related functionality grouped together
3. **Consistent Naming**: Follow established naming conventions
4. **Modular Design**: Each module has a single responsibility
5. **Type Safety**: Use TypeScript/Pydantic for type definitions