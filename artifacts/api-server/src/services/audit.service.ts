/**
 * Audit log service — append-only logging of sensitive actions.
 * Every sensitive operation should create an audit trail.
 */
import { db } from "@workspace/db";
import { auditLogsTable, type InsertAuditLog } from "@workspace/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, desc } from "drizzle-orm";
import type { Request } from "express";
import { logger } from "../lib/logger";

export interface AuditContext {
  actorId: string;
  actorRole: string;
  actorName: string;
  action: string;
  targetType?: string;
  targetId?: string;
  severity?: "Info" | "Warning" | "Critical";
  success?: boolean;
  metadata?: Record<string, unknown>;
  req?: Request;
}

/**
 * Create an audit log entry. This is append-only and should never fail silently.
 */
export async function createAuditLog(ctx: AuditContext): Promise<void> {
  try {
    let ipAddress: string | null = null;
    let userAgent: string | null = null;
    try {
      ipAddress = ((ctx.req?.headers?.["x-forwarded-for"] as string) || ctx.req?.socket?.remoteAddress || null) as string | null;
    } catch {}
    try {
      userAgent = (typeof ctx.req?.get === "function" ? ctx.req.get("user-agent") : (ctx.req?.headers?.["user-agent"] as string) || null) as string | null;
    } catch {}

    await db.insert(auditLogsTable).values({
      id: uuidv4(),
      actorId: ctx.actorId,
      actorRole: ctx.actorRole,
      actorName: ctx.actorName,
      action: ctx.action,
      targetType: ctx.targetType ?? null,
      targetId: ctx.targetId ?? null,
      severity: ctx.severity ?? "Info",
      success: ctx.success ?? true,
      metadata: ctx.metadata ? JSON.stringify(ctx.metadata) : null,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    // Audit logging failures must not crash the application but MUST be logged
    logger.error({ err: error, ctx }, "Failed to create audit log entry");
  }
}

/**
 * Get audit logs (admin only — access control is enforced at route level).
 */
export async function getAuditLogs(limit = 100, offset = 0) {
  return db
    .select()
    .from(auditLogsTable)
    .orderBy(desc(auditLogsTable.createdAt))
    .limit(limit)
    .offset(offset);
}
