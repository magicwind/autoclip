# AutoClip Product Overview

AutoClip is an AI-powered intelligent video clipping system that automatically downloads videos from YouTube/Bilibili, analyzes content using AI, extracts highlight segments, and generates intelligent collections.

## Core Features

- **Multi-platform Support**: YouTube and Bilibili video download, local file upload
- **AI Analysis**: Content understanding using Tongyi Qianwen LLM
- **Auto Clipping**: Smart identification and cutting of highlight segments
- **Smart Collections**: AI-recommended and manual video collections with drag-and-drop sorting
- **Real-time Processing**: Async task queue with real-time progress feedback via WebSocket
- **Modern UI**: React + TypeScript + Ant Design responsive interface
- **Bilibili Upload** (in development): Auto-upload clips to Bilibili with multi-account management
- **Subtitle Editor** (in development): Visual subtitle editing and synchronization

## Target Users

- Content creators who need to extract highlights from long-form videos
- Video editors looking for AI-assisted content processing
- Social media managers creating short-form content from longer videos

## Processing Pipeline

1. **Material Preparation**: Download video and subtitle files
2. **Content Analysis**: AI extracts video outline and key information
3. **Timeline Extraction**: Identify topic time intervals
4. **Highlight Scoring**: AI scores each segment for quality
5. **Title Generation**: Generate engaging titles for highlight clips
6. **Collection Recommendation**: AI recommends video collections
7. **Video Generation**: Generate clip videos and collection videos

## Video Categories

The system supports specialized processing for different content types:
- Knowledge/Educational content
- Entertainment (games, music, movies)
- Business/Entrepreneurship
- Experience sharing
- Opinion/Commentary
- Speeches/Lectures