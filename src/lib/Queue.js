import Bee from 'bee-queue';
import CancelletionMail from '../app/jobs/CancelletionMail';
import redisConfig from '../config/redis';


const jobs = [CancelletionMail];

class Queue {

    constructor() {
        this.queues = {};
        this.init();
    }
    init() {


        
        jobs.forEach(({ key, handle }) => {
            this.queues[key] = {
                bee: new Bee(key, {
                    redis: redisConfig
                }),
                handle,
            };
        });
    }

    add(queue, job) {
        console.log("ADD JOB" + JSON.stringify(job));
        console.log("ADD AQUI" + JSON.stringify(queue));

        return this.queues[queue].bee.createJob(job).save();
    }

    processQueue() {

        jobs.forEach(job => {
            const { bee, handle } = this.queues[job.key]

            bee.on('failed', this.handleFailure).process(handle)
        })


    }

    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err)
    }
}

export default new Queue();