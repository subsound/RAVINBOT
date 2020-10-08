require('dotenv').config();

const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')
const Extra = require('telegraf/extra')
const axios = require('axios')

const urlAPI = 'https://oapi.raveos.com/v1/';

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.command('status', async (ctx) => {
  const data = await getAllWorkers();
  let formatString = '';
  data.workers.forEach(worker => {
    formatString += `\nworkerID: ${worker.id}\nworkerName: ${worker.name}\nuptime: ${new Date(worker.uptime * 1000).toISOString().substr(11, 8)}\nhashrate: ${worker.hashrate / 1000000} MH/S\n`
  });
  ctx.reply(formatString);

})
// bot.command('worker', async (ctx) => {
//   const id = ctx.message.text.replace('/worker', '').trim();
//   const worker = await getWorkerById(id);
//   ctx.reply(worker.mining_info);
// });

bot.launch()

function getAllWorkers() {
  return axios.get(urlAPI + 'get_workers', { headers: { 'X-Auth-Token': process.env.RAVEOS_TOKEN } }).then(res => {
    return res.data
  });
}

function getWorkerById(id) {
  return axios.get(urlAPI + 'get_worker_info/' + id, { headers: { 'X-Auth-Token': process.env.RAVEOS_TOKEN } }).then(res => {
    return res.data;
  });
}

module.exports = bot;