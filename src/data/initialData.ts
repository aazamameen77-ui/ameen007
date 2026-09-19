import { FileItem, FolderItem, User, AppNotification } from '../types';

export const initialUser: User = {
  id: 'usr_sarah_jenkins',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@acmecorp.io',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  role: 'Product Design Lead',
  company: 'Acme Technologies Inc.',
  plan: 'Pro',
  usedStorage: 41231686016, // ~38.4 GB
  totalStorage: 107374182400, // 100 GB
  twoFactorEnabled: true,
  autoEmptyTrashDays: 30,
};

export const initialFolders: FolderItem[] = [
  {
    id: 'fld_design_sys',
    name: 'Design System & UI Kits',
    parentId: null,
    color: 'indigo',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-18T14:30:00Z',
    starred: true,
    inTrash: false,
    sharedWith: [
      {
        id: 'usr_collab_1',
        name: 'Alex Rivera',
        email: 'alex.r@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-08-12T11:00:00Z',
      },
      {
        id: 'usr_collab_2',
        name: 'Marcus Chen',
        email: 'marcus.c@acmecorp.io',
        role: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-08-15T09:30:00Z',
      },
    ],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_brand_guide',
    name: 'Brand Guidelines 2026',
    parentId: 'fld_design_sys',
    color: 'indigo',
    createdAt: '2026-08-14T12:00:00Z',
    updatedAt: '2026-09-15T16:20:00Z',
    starred: false,
    inTrash: false,
    sharedWith: [],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_financial_reports',
    name: 'Financial Reports 2026',
    parentId: null,
    color: 'emerald',
    createdAt: '2026-07-01T09:00:00Z',
    updatedAt: '2026-09-17T11:15:00Z',
    starred: true,
    inTrash: false,
    sharedWith: [
      {
        id: 'usr_collab_3',
        name: 'Elena Rostova',
        email: 'elena.finance@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-07-02T10:00:00Z',
      },
    ],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_q1_audited',
    name: 'Q1 Audited Statements',
    parentId: 'fld_financial_reports',
    color: 'emerald',
    createdAt: '2026-07-15T14:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
    starred: false,
    inTrash: false,
    sharedWith: [],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_marketing',
    name: 'Marketing & Social Campaigns',
    parentId: null,
    color: 'amber',
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-09-19T05:45:00Z',
    starred: false,
    inTrash: false,
    sharedWith: [],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_engineering_rfcs',
    name: 'Product Specs & RFCs',
    parentId: null,
    color: 'blue',
    createdAt: '2026-06-12T11:20:00Z',
    updatedAt: '2026-09-18T09:00:00Z',
    starred: true,
    inTrash: false,
    sharedWith: [
      {
        id: 'usr_collab_4',
        name: 'Devin Thorne',
        email: 'devin@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-06-15T15:00:00Z',
      },
    ],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_photography',
    name: 'Studio Photography Shoots',
    parentId: null,
    color: 'rose',
    createdAt: '2026-07-25T16:00:00Z',
    updatedAt: '2026-09-10T12:00:00Z',
    starred: false,
    inTrash: false,
    sharedWith: [],
    ownerId: 'usr_sarah_jenkins',
  },
  {
    id: 'fld_archive_old',
    name: 'Deprecated Wireframes 2025',
    parentId: null,
    color: 'slate',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-14T09:00:00Z',
    starred: false,
    inTrash: true,
    trashDate: '2026-09-14T08:30:00Z',
    sharedWith: [],
    ownerId: 'usr_sarah_jenkins',
  },
];

export const initialFiles: FileItem[] = [
  {
    id: 'file_mockup_landing',
    name: 'CloudVault_App_Hero_Mockup.png',
    size: 4423680, // ~4.2 MB
    type: 'image',
    mimeType: 'image/png',
    extension: 'png',
    folderId: 'fld_design_sys',
    createdAt: '2026-09-18T14:30:00Z',
    updatedAt: '2026-09-18T14:30:00Z',
    starred: true,
    inTrash: false,
    dimensions: '2560 x 1440 px',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    sharedWith: [
      {
        id: 'usr_collab_1',
        name: 'Alex Rivera',
        email: 'alex.r@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-09-18T15:00:00Z',
      },
    ],
    shareLink: {
      enabled: true,
      code: 'cv-img-hero-984',
      allowDownload: true,
      accessCount: 28,
    },
    tags: ['Design', 'Hero', 'Landing', 'Q3'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_annual_budget',
    name: 'Executive_Q3_Revenue_Forecast.xlsx',
    size: 2845200, // ~2.7 MB
    type: 'spreadsheet',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
    folderId: 'fld_financial_reports',
    createdAt: '2026-09-17T11:15:00Z',
    updatedAt: '2026-09-19T06:10:00Z',
    starred: true,
    inTrash: false,
    contentPreview: 'Category | Q1 Actual | Q2 Actual | Q3 Projected | Growth YoY\nSaaS Subscription | $1,240,000 | $1,580,000 | $1,920,000 | +42%\nEnterprise Licences | $850,000 | $940,000 | $1,150,000 | +28%\nCloud Storage Addons | $120,000 | $190,000 | $260,000 | +65%\nTotal Gross Revenue | $2,210,000 | $2,710,000 | $3,330,000 | +41%',
    sharedWith: [
      {
        id: 'usr_collab_3',
        name: 'Elena Rostova',
        email: 'elena.finance@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-09-17T12:00:00Z',
      },
    ],
    shareLink: {
      enabled: true,
      code: 'cv-fin-q3-forecast',
      passwordProtected: true,
      allowDownload: true,
      accessCount: 14,
    },
    tags: ['Finance', 'Q3', 'Executive'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_cloud_arch_pdf',
    name: 'CloudVault_System_Architecture_v2.pdf',
    size: 8942100, // ~8.5 MB
    type: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    folderId: 'fld_engineering_rfcs',
    createdAt: '2026-09-15T09:20:00Z',
    updatedAt: '2026-09-18T10:05:00Z',
    starred: true,
    inTrash: false,
    contentPreview: 'CLOUDFLOW ARCHITECTURE WHITE PAPER\nRevision 2.4 - High Throughput Distributed Storage Engine\n\n1. Executive Abstract\nThis architecture blueprint details the multi-tenant chunking protocol, AES-256 client-side envelope encryption, and geo-replicated hot/cold tiering implemented across the CloudVault infrastructure.\n\n2. Key Architectural Pillars\n- Latency: < 45ms P99 object metadata access via distributed edge cache.\n- Resiliency: 99.999999999% (11 nines) durable blob persistence across 3 regions.\n- Zero-Knowledge Access: Ephemeral tokenized link generation with time-to-live expiration.\n\n3. Ingestion Pipeline & Chunking Engine\nFiles larger than 10MB are automatically divided into 4MB cryptographic blocks with parallel verification hashes (SHA-256) before commit.',
    sharedWith: [
      {
        id: 'usr_collab_4',
        name: 'Devin Thorne',
        email: 'devin@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        addedAt: '2026-09-15T10:00:00Z',
      },
    ],
    tags: ['RFC', 'Specs', 'Engineering', 'Architecture'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_product_keynote',
    name: 'Product_Launch_Keynote_2026.pptx',
    size: 15420000, // ~14.7 MB
    type: 'presentation',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'pptx',
    folderId: null,
    createdAt: '2026-09-16T16:00:00Z',
    updatedAt: '2026-09-19T02:30:00Z',
    starred: false,
    inTrash: false,
    contentPreview: 'SLIDE 1: Unveiling CloudVault Next-Gen Storage\nSLIDE 2: Problem: Enterprise data fragmentation & slow collaboration\nSLIDE 3: Solution: Unified instant preview, role-based link sharing, encrypted tiers\nSLIDE 4: Traction: 450+ enterprise teams onboarded in Q2\nSLIDE 5: Roadmap: AI semantic file categorization & instant smart search',
    sharedWith: [],
    tags: ['Pitch', 'Keynote', 'Marketing'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_demo_walkthrough_video',
    name: 'Customer_Onboarding_Walkthrough.mp4',
    size: 48290000, // ~46 MB
    type: 'video',
    mimeType: 'video/mp4',
    extension: 'mp4',
    folderId: 'fld_marketing',
    createdAt: '2026-09-14T11:00:00Z',
    updatedAt: '2026-09-14T11:00:00Z',
    starred: false,
    inTrash: false,
    duration: '03:45',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sharedWith: [],
    tags: ['Video', 'Demo', 'Tutorial'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_podcast_episode',
    name: 'TechTalk_Episode_28_CloudFuture.mp3',
    size: 19850000, // ~18.9 MB
    type: 'audio',
    mimeType: 'audio/mpeg',
    extension: 'mp3',
    folderId: null,
    createdAt: '2026-09-12T14:20:00Z',
    updatedAt: '2026-09-12T14:20:00Z',
    starred: false,
    inTrash: false,
    duration: '21:14',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    sharedWith: [],
    tags: ['Podcast', 'Audio', 'Interview'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_api_middleware_code',
    name: 'fileStreamingMiddleware.ts',
    size: 42100, // ~41 KB
    type: 'code',
    mimeType: 'text/typescript',
    extension: 'ts',
    folderId: 'fld_engineering_rfcs',
    createdAt: '2026-09-10T13:40:00Z',
    updatedAt: '2026-09-18T18:00:00Z',
    starred: false,
    inTrash: false,
    contentPreview: `import { Request, Response, NextFunction } from 'express';
import { createReadStream, statSync } from 'fs';
import { pipeline } from 'stream/promises';

export interface ChunkStreamOptions {
  chunkSizeBytes: number;
  enableEtag: boolean;
  rateLimitKbps?: number;
}

/**
 * High performance range-request streaming middleware for large video & media files.
 * Handles HTTP 206 Partial Content transparently.
 */
export async function streamRangeHandler(req: Request, res: Response, filePath: string, options: ChunkStreamOptions) {
  const stat = statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'application/octet-stream',
      'Accept-Ranges': 'bytes',
    });
    return pipeline(createReadStream(filePath), res);
  }

  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = (end - start) + 1;

  res.writeHead(206, {
    'Content-Range': \`bytes \${start}-\${end}/\${fileSize}\`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'application/octet-stream',
  });

  const fileStream = createReadStream(filePath, { start, end });
  return pipeline(fileStream, res);
}`,
    sharedWith: [],
    tags: ['Backend', 'TypeScript', 'Streaming'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_brand_logo_kit',
    name: 'Acme_Brand_Vector_Icons_v4.zip',
    size: 34100000, // ~32.5 MB
    type: 'archive',
    mimeType: 'application/zip',
    extension: 'zip',
    folderId: 'fld_brand_guide',
    createdAt: '2026-08-28T15:00:00Z',
    updatedAt: '2026-08-28T15:00:00Z',
    starred: false,
    inTrash: false,
    sharedWith: [],
    tags: ['Branding', 'Logos', 'SVG', 'Icons'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_studio_photo_1',
    name: 'Modern_Minimalist_Workspace_01.jpg',
    size: 6120000, // ~5.8 MB
    type: 'image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    folderId: 'fld_photography',
    createdAt: '2026-09-08T10:14:00Z',
    updatedAt: '2026-09-08T10:14:00Z',
    starred: false,
    inTrash: false,
    dimensions: '3840 x 2160 px',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
    sharedWith: [],
    tags: ['Photography', 'Workspace', 'Hi-Res'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_studio_photo_2',
    name: 'Hardware_Prototype_Macro_Detail.jpg',
    size: 7850000, // ~7.5 MB
    type: 'image',
    mimeType: 'image/jpeg',
    extension: 'jpg',
    folderId: 'fld_photography',
    createdAt: '2026-09-08T10:30:00Z',
    updatedAt: '2026-09-08T10:30:00Z',
    starred: true,
    inTrash: false,
    dimensions: '4096 x 2730 px',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    sharedWith: [],
    tags: ['Photography', 'Macro', 'Hardware'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_shared_security_audit',
    name: 'SOC2_Type_II_Compliance_Report.pdf',
    size: 5120000, // ~4.9 MB
    type: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    folderId: null,
    createdAt: '2026-09-02T13:00:00Z',
    updatedAt: '2026-09-17T09:40:00Z',
    starred: true,
    inTrash: false,
    contentPreview: 'INDEPENDENT SERVICE AUDITOR’S REPORT ON SOC 2 TYPE II COMPLIANCE\n\nScope of Examination:\nWe have audited the description of CloudVault’s SaaS and File Storage Infrastructure system throughout the period September 1, 2025 to August 31, 2026.\n\nOpinion:\nIn our opinion, in all material respects, based on the criteria in the description:\na. The description fairly presents the system that was designed and implemented throughout the specified period.\nb. The controls stated in the description were suitably designed and operating with effective safeguards for Security, Availability, and Confidentiality.',
    sharedWith: [
      {
        id: 'usr_sarah_jenkins',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@acmecorp.io',
        role: 'editor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        addedAt: '2026-09-02T14:00:00Z',
      },
    ],
    tags: ['Security', 'SOC2', 'Audit'],
    ownerId: 'usr_external_auditor',
    ownerName: 'Grant Thornton LLP',
  },
  {
    id: 'file_shared_design_critique',
    name: 'Mobile_iOS_Wireframes_Spec.pdf',
    size: 11200000, // ~10.7 MB
    type: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    folderId: null,
    createdAt: '2026-09-11T14:15:00Z',
    updatedAt: '2026-09-16T18:22:00Z',
    starred: false,
    inTrash: false,
    contentPreview: 'MOBILE CLIENT SPECIFICATION - iOS 19 & iPadOS\n\n1. Navigation Hierarchy\nBottom Tab Bar: Files, Recents, Offline, Search, Settings\nDynamic Island integration during active multi-gigabyte background uploads with progress ring.\n\n2. Biometric Lock\nOptional FaceID/TouchID prompt upon app foregrounding with zero-cache image buffers.',
    sharedWith: [
      {
        id: 'usr_sarah_jenkins',
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@acmecorp.io',
        role: 'viewer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        addedAt: '2026-09-11T16:00:00Z',
      },
    ],
    tags: ['iOS', 'Mobile', 'UI/UX'],
    ownerId: 'usr_collab_1',
    ownerName: 'Alex Rivera',
  },
  {
    id: 'file_trash_old_invoice',
    name: 'Old_Vendor_Receipt_Nov2025.pdf',
    size: 420000, // 420 KB
    type: 'document',
    mimeType: 'application/pdf',
    extension: 'pdf',
    folderId: null,
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z',
    starred: false,
    inTrash: true,
    trashDate: '2026-09-16T09:00:00Z',
    sharedWith: [],
    tags: ['Invoice', 'Receipt'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
  {
    id: 'file_trash_raw_clip',
    name: 'Uncut_B-Roll_Studio_Lighting.mov',
    size: 92400000, // ~88 MB
    type: 'video',
    mimeType: 'video/quicktime',
    extension: 'mov',
    folderId: null,
    createdAt: '2026-08-04T12:00:00Z',
    updatedAt: '2026-08-04T12:00:00Z',
    starred: false,
    inTrash: true,
    trashDate: '2026-09-17T14:10:00Z',
    duration: '01:12',
    sharedWith: [],
    tags: ['Video', 'Trash'],
    ownerId: 'usr_sarah_jenkins',
    ownerName: 'Sarah Jenkins',
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'File shared with you',
    description: 'Alex Rivera shared "Mobile_iOS_Wireframes_Spec.pdf" with viewer permissions.',
    timestamp: '2026-09-19T05:30:00Z',
    read: false,
    type: 'share',
    fileId: 'file_shared_design_critique',
  },
  {
    id: 'notif_2',
    title: 'Shared link accessed',
    description: 'Someone accessed your public link for "CloudVault_App_Hero_Mockup.png".',
    timestamp: '2026-09-18T19:15:00Z',
    read: false,
    type: 'share',
    fileId: 'file_mockup_landing',
  },
  {
    id: 'notif_3',
    title: 'Backup sync completed',
    description: 'All 14 project files were securely synced to encrypted cloud storage.',
    timestamp: '2026-09-18T10:00:00Z',
    read: true,
    type: 'upload',
  },
  {
    id: 'notif_4',
    title: 'Storage usage milestone',
    description: 'You have used 38% of your 100 GB Pro plan quota.',
    timestamp: '2026-09-17T08:00:00Z',
    read: true,
    type: 'storage',
  },
];
