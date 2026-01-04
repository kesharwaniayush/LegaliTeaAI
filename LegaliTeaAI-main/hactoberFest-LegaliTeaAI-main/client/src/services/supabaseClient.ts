import { createClient } from "@supabase/supabase-js";
import type { AnalysisResult } from "../types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client (will be null if env vars not set)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Database types
export interface SummaryRecord {
  id: string;
  email: string;
  original_text: string;
  analysis_result: AnalysisResult;
  document_type: string;
  created_at: string;
  expires_at: string;
  saved: boolean;
}

// Supabase service class
export class SupabaseService {
  private client = supabase;

  constructor() {
    if (!this.client) {
      console.warn(
        "Supabase client not initialized. Check environment variables."
      );
    }
  }

  // Save analysis to database
  async saveAnalysis(
    email: string,
    analysis: AnalysisResult
  ): Promise<{ id: string; expires_at: string }> {
    if (!this.client) {
      throw new Error(
        "Supabase not configured. Please check environment variables."
      );
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    const record = {
      email: email.toLowerCase().trim(),
      original_text: analysis.originalText,
      analysis_result: analysis,
      document_type: analysis.documentType,
      expires_at: expiresAt.toISOString(),
      saved: true,
    };

    const { data, error } = await this.client
      .from("summaries")
      .insert([record])
      .select("id, expires_at")
      .single();

    if (error) {
      console.error("Supabase save error:", error);
      throw new Error("Failed to save analysis. Please try again.");
    }

    return data;
  }

  // Retrieve analysis by ID
  async getAnalysis(id: string): Promise<SummaryRecord | null> {
    if (!this.client) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await this.client
      .from("summaries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Record not found
      }
      throw new Error("Failed to retrieve analysis");
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (now > expiresAt) {
      // Delete expired record
      await this.deleteAnalysis(id);
      return null;
    }

    return data;
  }

  // Delete analysis
  async deleteAnalysis(id: string): Promise<void> {
    if (!this.client) return;

    const { error } = await this.client.from("summaries").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete analysis:", error);
    }
  }

  // Get analyses by email (for user to see their saved analyses)
  async getAnalysesByEmail(email: string): Promise<SummaryRecord[]> {
    if (!this.client) {
      throw new Error("Supabase not configured");
    }

    const { data, error } = await this.client
      .from("summaries")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error("Failed to retrieve analyses");
    }

    return data || [];
  }

  // Check if Supabase is available
  isAvailable(): boolean {
    return this.client !== null;
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();

// Mock service for development when Supabase is not configured
export class MockSupabaseService {
  private storage = new Map<string, SummaryRecord>();

  async saveAnalysis(
    email: string,
    analysis: AnalysisResult
  ): Promise<{ id: string; expires_at: string }> {
    const id = Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const record: SummaryRecord = {
      id,
      email: email.toLowerCase().trim(),
      original_text: analysis.originalText,
      analysis_result: analysis,
      document_type: analysis.documentType,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      saved: true,
    };

    this.storage.set(id, record);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { id, expires_at: expiresAt.toISOString() };
  }

  async getAnalysis(id: string): Promise<SummaryRecord | null> {
    const record = this.storage.get(id);
    if (!record) return null;

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(record.expires_at);

    if (now > expiresAt) {
      this.storage.delete(id);
      return null;
    }

    return record;
  }

  async deleteAnalysis(id: string): Promise<void> {
    this.storage.delete(id);
  }

  async getAnalysesByEmail(email: string): Promise<SummaryRecord[]> {
    const records = Array.from(this.storage.values())
      .filter((record) => record.email === email.toLowerCase().trim())
      .filter((record) => new Date(record.expires_at) > new Date())
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    return records;
  }

  isAvailable(): boolean {
    return true;
  }
}

// Use mock service in development if Supabase is not configured
export const storageService = supabaseService.isAvailable()
  ? supabaseService
  : new MockSupabaseService();
