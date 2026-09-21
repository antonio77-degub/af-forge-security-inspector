export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alert_events: {
        Row: {
          alert_id: string
          created_at: string
          event_type: string
          id: number
          payload: Json
          project_id: string
        }
        Insert: {
          alert_id: string
          created_at?: string
          event_type: string
          id?: never
          payload?: Json
          project_id: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          event_type?: string
          id?: never
          payload?: Json
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_events_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      alerts: {
        Row: {
          acknowledged_at: string | null
          asset_id: string | null
          category: string
          created_at: string
          finding_id: string | null
          id: string
          message: string
          monitor_id: string | null
          project_id: string
          resolved_at: string | null
          severity: string
          status: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          asset_id?: string | null
          category: string
          created_at?: string
          finding_id?: string | null
          id?: string
          message: string
          monitor_id?: string | null
          project_id: string
          resolved_at?: string | null
          severity: string
          status?: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          asset_id?: string | null
          category?: string
          created_at?: string
          finding_id?: string | null
          id?: string
          message?: string
          monitor_id?: string | null
          project_id?: string
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_relations: {
        Row: {
          evidence: Json
          first_observed_at: string
          id: string
          last_observed_at: string
          project_id: string
          relation_type: string
          source_asset_id: string
          target_asset_id: string
        }
        Insert: {
          evidence?: Json
          first_observed_at?: string
          id?: string
          last_observed_at?: string
          project_id: string
          relation_type: string
          source_asset_id: string
          target_asset_id: string
        }
        Update: {
          evidence?: Json
          first_observed_at?: string
          id?: string
          last_observed_at?: string
          project_id?: string
          relation_type?: string
          source_asset_id?: string
          target_asset_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_relations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_relations_source_asset_id_fkey"
            columns: ["source_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_relations_target_asset_id_fkey"
            columns: ["target_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_type: string
          created_at: string
          id: string
          is_primary: boolean
          metadata: Json
          normalized_value: string
          project_id: string
          updated_at: string
          value: string
        }
        Insert: {
          asset_type: string
          created_at?: string
          id?: string
          is_primary?: boolean
          metadata?: Json
          normalized_value: string
          project_id: string
          updated_at?: string
          value: string
        }
        Update: {
          asset_type?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          metadata?: Json
          normalized_value?: string
          project_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: number
          metadata: Json
          project_id: string
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: never
          metadata?: Json
          project_id: string
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: never
          metadata?: Json
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      finding_evidence: {
        Row: {
          data: Json
          evidence_type: string
          finding_id: string
          id: string
          observed_at: string
          project_id: string
          source_url: string | null
          summary: string | null
        }
        Insert: {
          data?: Json
          evidence_type: string
          finding_id: string
          id?: string
          observed_at?: string
          project_id: string
          source_url?: string | null
          summary?: string | null
        }
        Update: {
          data?: Json
          evidence_type?: string
          finding_id?: string
          id?: string
          observed_at?: string
          project_id?: string
          source_url?: string | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finding_evidence_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finding_evidence_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      finding_remediations: {
        Row: {
          created_at: string
          finding_id: string
          id: string
          instructions: Json
          platform_key: string | null
          project_id: string
          reference_links: Json
          summary: string
        }
        Insert: {
          created_at?: string
          finding_id: string
          id?: string
          instructions?: Json
          platform_key?: string | null
          project_id: string
          reference_links?: Json
          summary: string
        }
        Update: {
          created_at?: string
          finding_id?: string
          id?: string
          instructions?: Json
          platform_key?: string | null
          project_id?: string
          reference_links?: Json
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "finding_remediations_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finding_remediations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      findings: {
        Row: {
          asset_id: string | null
          confidence: string
          created_at: string
          explanation_simple: string
          fingerprint: string
          first_seen_at: string
          id: string
          last_seen_at: string
          module_key: string
          project_id: string
          provider_key: string
          resolved_at: string | null
          scan_id: string
          severity: string
          status: string
          technical_summary: string | null
          technical_title: string
          title_simple: string
        }
        Insert: {
          asset_id?: string | null
          confidence: string
          created_at?: string
          explanation_simple: string
          fingerprint: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          module_key: string
          project_id: string
          provider_key: string
          resolved_at?: string | null
          scan_id: string
          severity: string
          status: string
          technical_summary?: string | null
          technical_title: string
          title_simple: string
        }
        Update: {
          asset_id?: string | null
          confidence?: string
          created_at?: string
          explanation_simple?: string
          fingerprint?: string
          first_seen_at?: string
          id?: string
          last_seen_at?: string
          module_key?: string
          project_id?: string
          provider_key?: string
          resolved_at?: string | null
          scan_id?: string
          severity?: string
          status?: string
          technical_summary?: string | null
          technical_title?: string
          title_simple?: string
        }
        Relationships: [
          {
            foreignKeyName: "findings_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "findings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "findings_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      monitor_runs: {
        Row: {
          created_at: string
          error_code: string | null
          finished_at: string | null
          id: string
          monitor_id: string
          project_id: string
          scan_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          finished_at?: string | null
          id?: string
          monitor_id: string
          project_id: string
          scan_id?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          created_at?: string
          error_code?: string | null
          finished_at?: string | null
          id?: string
          monitor_id?: string
          project_id?: string
          scan_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitor_runs_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitor_runs_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      monitors: {
        Row: {
          asset_id: string
          config: Json
          created_at: string
          created_by: string
          enabled: boolean
          id: string
          interval_minutes: number
          last_run_at: string | null
          monitor_type: string
          next_run_at: string | null
          project_id: string
          updated_at: string
        }
        Insert: {
          asset_id: string
          config?: Json
          created_at?: string
          created_by: string
          enabled?: boolean
          id?: string
          interval_minutes: number
          last_run_at?: string | null
          monitor_type: string
          next_run_at?: string | null
          project_id: string
          updated_at?: string
        }
        Update: {
          asset_id?: string
          config?: Json
          created_at?: string
          created_by?: string
          enabled?: boolean
          id?: string
          interval_minutes?: number
          last_run_at?: string | null
          monitor_type?: string
          next_run_at?: string | null
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitors_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monitors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      provider_runs: {
        Row: {
          attempt: number
          error_class: string | null
          error_code: string | null
          finished_at: string | null
          id: string
          latency_ms: number | null
          project_id: string
          provider_key: string
          response_meta: Json
          scan_id: string
          scan_module_id: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          attempt?: number
          error_class?: string | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          latency_ms?: number | null
          project_id: string
          provider_key: string
          response_meta?: Json
          scan_id: string
          scan_module_id?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          attempt?: number
          error_class?: string | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          latency_ms?: number | null
          project_id?: string
          provider_key?: string
          response_meta?: Json
          scan_id?: string
          scan_module_id?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_runs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_runs_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_runs_scan_module_id_fkey"
            columns: ["scan_module_id"]
            isOneToOne: false
            referencedRelation: "scan_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_usage: {
        Row: {
          billable_units: number
          currency: string
          estimated_cost: number
          id: number
          project_id: string
          provider_key: string
          recorded_at: string
          request_count: number
          scan_id: string | null
        }
        Insert: {
          billable_units?: number
          currency?: string
          estimated_cost?: number
          id?: never
          project_id: string
          provider_key: string
          recorded_at?: string
          request_count?: number
          scan_id?: string | null
        }
        Update: {
          billable_units?: number
          currency?: string
          estimated_cost?: number
          id?: never
          project_id?: string
          provider_key?: string
          recorded_at?: string
          request_count?: number
          scan_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_usage_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_usage_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      report_shares: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          project_id: string
          report_id: string
          revoked_at: string | null
          token_hash: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id: string
          report_id: string
          revoked_at?: string | null
          token_hash: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          project_id?: string
          report_id?: string
          revoked_at?: string | null
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_shares_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_shares_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          id: string
          project_id: string
          ready_at: string | null
          report_type: string
          scan_id: string | null
          status: string
          storage_path: string | null
          title: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          project_id: string
          ready_at?: string | null
          report_type: string
          scan_id?: string | null
          status: string
          storage_path?: string | null
          title: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string
          ready_at?: string | null
          report_type?: string
          scan_id?: string | null
          status?: string
          storage_path?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_changes: {
        Row: {
          change_type: string
          created_at: string
          finding_id: string | null
          from_scan_id: string | null
          id: string
          project_id: string
          summary: string
          to_scan_id: string
        }
        Insert: {
          change_type: string
          created_at?: string
          finding_id?: string | null
          from_scan_id?: string | null
          id?: string
          project_id: string
          summary: string
          to_scan_id: string
        }
        Update: {
          change_type?: string
          created_at?: string
          finding_id?: string | null
          from_scan_id?: string | null
          id?: string
          project_id?: string
          summary?: string
          to_scan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_changes_finding_id_fkey"
            columns: ["finding_id"]
            isOneToOne: false
            referencedRelation: "findings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_changes_from_scan_id_fkey"
            columns: ["from_scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_changes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_changes_to_scan_id_fkey"
            columns: ["to_scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_modules: {
        Row: {
          coverage: number | null
          error_code: string | null
          finished_at: string | null
          id: string
          module_key: string
          project_id: string
          scan_id: string
          score: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          coverage?: number | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          module_key: string
          project_id: string
          scan_id: string
          score?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          coverage?: number | null
          error_code?: string | null
          finished_at?: string | null
          id?: string
          module_key?: string
          project_id?: string
          scan_id?: string
          score?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_modules_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_modules_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_presets: {
        Row: {
          config: Json
          created_at: string
          created_by: string
          id: string
          name: string
          project_id: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by: string
          id?: string
          name: string
          project_id: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_presets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_snapshots: {
        Row: {
          asset_id: string | null
          created_at: string
          id: string
          payload: Json
          project_id: string
          scan_id: string
          snapshot_kind: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          id?: string
          payload: Json
          project_id: string
          scan_id: string
          snapshot_kind: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          id?: string
          payload?: Json
          project_id?: string
          scan_id?: string
          snapshot_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_snapshots_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_snapshots_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_snapshots_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          asset_id: string | null
          confidence: string | null
          coverage: number | null
          created_at: string
          finished_at: string | null
          id: string
          initiated_by: string | null
          mode: string
          project_id: string
          requested_config: Json
          score: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          asset_id?: string | null
          confidence?: string | null
          coverage?: number | null
          created_at?: string
          finished_at?: string | null
          id?: string
          initiated_by?: string | null
          mode: string
          project_id: string
          requested_config?: Json
          score?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          asset_id?: string | null
          confidence?: string | null
          coverage?: number | null
          created_at?: string
          finished_at?: string | null
          id?: string
          initiated_by?: string | null
          mode?: string
          project_id?: string
          requested_config?: Json
          score?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scans_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scans_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      status_page_components: {
        Row: {
          asset_id: string | null
          created_at: string
          id: string
          label: string
          position: number
          project_id: string
          status_page_id: string
        }
        Insert: {
          asset_id?: string | null
          created_at?: string
          id?: string
          label: string
          position?: number
          project_id: string
          status_page_id: string
        }
        Update: {
          asset_id?: string | null
          created_at?: string
          id?: string
          label?: string
          position?: number
          project_id?: string
          status_page_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_page_components_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_page_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_page_components_status_page_id_fkey"
            columns: ["status_page_id"]
            isOneToOne: false
            referencedRelation: "status_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      status_pages: {
        Row: {
          config: Json
          created_at: string
          created_by: string | null
          id: string
          is_public: boolean
          name: string
          project_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean
          name: string
          project_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          is_public?: boolean
          name?: string
          project_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "status_pages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      uptime_checks: {
        Row: {
          asset_id: string
          available: boolean
          checked_at: string
          error_code: string | null
          id: number
          latency_ms: number | null
          monitor_id: string
          project_id: string
          status_code: number | null
        }
        Insert: {
          asset_id: string
          available: boolean
          checked_at?: string
          error_code?: string | null
          id?: never
          latency_ms?: number | null
          monitor_id: string
          project_id: string
          status_code?: number | null
        }
        Update: {
          asset_id?: string
          available?: boolean
          checked_at?: string
          error_code?: string | null
          id?: never
          latency_ms?: number | null
          monitor_id?: string
          project_id?: string
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "uptime_checks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uptime_checks_monitor_id_fkey"
            columns: ["monitor_id"]
            isOneToOne: false
            referencedRelation: "monitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uptime_checks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
