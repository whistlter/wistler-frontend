import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from 'crypto';

const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE!;
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY!;
const WEBHOOK_SECRET = process.env.VERCEL_WEBHOOK_SECRET!;

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
    const expected = crypto
        .createHmac('sha1', secret)
        .update(rawBody)
        .digest('hex');
    return signature === expected;
}

function getEmoji(type: string): string {
    switch (type) {
        case 'deployment.ready':   return '✅';
        case 'deployment.error':   return '❌';
        case 'deployment.created': return '🚀';
        case 'deployment.canceled': return '⛔';
        default: return '📦';
    }
}

function buildMessage(payload: Record<string, unknown>): string {
    const type = payload.type as string;
    const deployment = payload.deployment as Record<string, unknown> | undefined;

    const emoji = getEmoji(type);
    const projectName = (payload.project as Record<string, unknown>)?.name ?? 'Unknown Project';
    const branch = (deployment?.meta as Record<string, unknown>)?.githubCommitRef ?? 'unknown branch';
    const author = (deployment?.meta as Record<string, unknown>)?.githubCommitAuthorName ?? 'unknown';
    const commitMsg = (deployment?.meta as Record<string, unknown>)?.githubCommitMessage ?? '';
    const url = deployment?.url ? `https://${deployment.url}` : '';

    const statusMap: Record<string, string> = {
        'deployment.created': 'Build started',
        'deployment.ready':   'Build successful',
        'deployment.error':   'Build failed',
        'deployment.canceled': 'Build canceled',
    };

    const status = statusMap[type] ?? type;

    const lines = [
        `${emoji} *Vercel — ${status}*`,
        `Project: ${projectName}`,
        `Branch: ${branch}`,
        `Author: ${author}`,
        ...(commitMsg ? [`Commit: ${commitMsg.split('\n')[0]}`] : []),
        ...(url && type === 'deployment.ready' ? [`URL: ${url}`] : []),
    ];

    return lines.join('\n');
}

async function sendWhatsApp(message: string): Promise<void> {
    const encoded = encodeURIComponent(message);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encoded}&apikey=${CALLMEBOT_APIKEY}`;
    await fetch(url);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify Vercel signature
    const signature = req.headers['x-vercel-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload = req.body as Record<string, unknown>;
    const type = payload.type as string;

    // Only handle deployment events
    const handledEvents = ['deployment.created', 'deployment.ready', 'deployment.error', 'deployment.canceled'];
    if (!handledEvents.includes(type)) {
        return res.status(200).json({ message: 'Event ignored' });
    }

    const message = buildMessage(payload);
    await sendWhatsApp(message);

    return res.status(200).json({ message: 'Notification sent' });
}
