# Support Ticket Auto-Triage System

A modern, intelligent customer support ticket system that automatically classifies and prioritizes incoming support requests using rule-based AI classification. Built with Next.js 16, React 19, and Supabase.

## 🚀 Features

- **Intelligent Auto-Triage**: Automatically classifies tickets into categories (bug-report, feature-request, technical-issue, billing, account)
- **Smart Priority Assignment**: Determines ticket priority (critical, high, medium, low) based on content analysis
- **Admin Dashboard**: Comprehensive dashboard for viewing and managing all support tickets
- **Modern UI**: Clean, responsive interface built with shadcn/ui and Tailwind CSS
- **Real-time Updates**: Live ticket status and management
- **Type-Safe**: Full TypeScript implementation for reliability
- **Database Integration**: Powered by Supabase with Row Level Security

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project

## 🏁 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customer-support
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database setup scripts:
     ```bash
     # Execute these in your Supabase SQL editor or via CLI
     # scripts/01_create_tables.sql
     # scripts/02_create_support_table.sql
     ```

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── classify/             # Ticket classification endpoint
│   │   ├── support/              # Support message handling
│   │   └── tickets/              # Ticket CRUD operations
│   ├── dashboard/                # Admin dashboard page
│   └── page.tsx                  # Main ticket submission page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── admin-dashboard.tsx       # Admin ticket management
│   ├── ticket-submission-form.tsx # Ticket submission form
│   └── support-dialog.tsx        # Support interaction dialog
├── lib/                          # Utility libraries
│   └── supabase/                 # Supabase client configuration
├── scripts/                      # Database setup scripts
└── hooks/                        # Custom React hooks
```

## 🎯 How It Works

### Ticket Classification
The system uses a rule-based classification engine that analyzes ticket content to:

1. **Categorize tickets** based on keywords:
   - Bug Report: "bug", "error", "crash", "broken"
   - Feature Request: "feature", "request", "enhancement"
   - Technical Issue: "help", "guide", "troubleshoot"
   - Billing: "invoice", "billing", "payment"
   - Account: "login", "password", "account"

2. **Assign priority** based on urgency keywords:
   - Critical: "urgent", "critical", "blocked", "emergency"
   - High: "important", "asap", "immediate"
   - Medium: Default priority
   - Low: "minor", "cosmetic", "suggestion"

### Database Schema

**Tickets Table:**
- `id`: Primary key
- `ticket_id`: Unique ticket identifier
- `subject`: Ticket subject
- `description`: Full ticket description
- `category`: Classified category
- `priority`: Assigned priority level
- `status`: Ticket status (open, in-progress, resolved, closed)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Support Messages Table:**
- `id`: Primary key
- `email`: Customer email
- `subject`: Message subject
- `message`: Message content
- `created_at`: Creation timestamp

## 🚀 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🔧 API Endpoints

### POST `/api/classify`
Classifies a ticket based on subject and description.

**Request:**
```json
{
  "subject": "App crashes on startup",
  "description": "The application crashes immediately when I try to open it"
}
```

**Response:**
```json
{
  "category": "bug-report",
  "priority": "high",
  "confidence": 0.85,
  "reasoning": "Based on content analysis: detected keywords related to bug report with high priority."
}
```

### POST `/api/tickets`
Creates a new support ticket.

### GET `/api/tickets`
Retrieves all tickets (admin functionality).

### PUT `/api/tickets/[ticketId]`
Updates ticket status and details.

## 🎨 Customization

### Adding New Categories
1. Update the classification keywords in `app/api/classify/route.ts`
2. Add corresponding UI handling in components
3. Update database indexes if needed

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize shadcn/ui components in `components/ui/`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔄 Future Enhancements

- [ ] AI-powered classification using machine learning models
- [ ] Email integration for ticket creation
- [ ] Slack/Discord notifications for new tickets
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Customer portal for ticket tracking
- [ ] Integration with popular helpdesk tools
