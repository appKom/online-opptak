export default function handler(req, res) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }

    // TODO Check for correct time and run algorithm.
    res.status(200).end('Hello Cron!');

    const spawn = require("child_process").spawn;

    const algorithmProcess = spawn('cd algorithm', ["path/to/script.py", arg1, arg2,], { cwd: "./algorithm/ " });
}