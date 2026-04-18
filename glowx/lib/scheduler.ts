import { Queue } from 'bullmq'

const connection = {
  url: process.env.UPSTASH_REDIS_REST_URL ?? '',
}

export const schedulerQueue = new Queue('content-scheduler', {
  connection: { host: 'localhost', port: 6379 } as any,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  },
})

export async function schedulePost(scheduledPostId: string, publishAt: Date) {
  const delay = publishAt.getTime() - Date.now()
  if (delay < 0) throw new Error('Cannot schedule in the past')
  const job = await schedulerQueue.add(
    'publish-post',
    { scheduledPostId },
    { delay, jobId: `post-${scheduledPostId}` }
  )
  return job.id
}

export async function cancelScheduledPost(jobId: string) {
  const job = await schedulerQueue.getJob(jobId)
  if (job) await job.remove()
}
