const { find } = require('./launches.mongo');
const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber:100,
    mission:"Kepler Exploration X",
    rocket:"Explorer IS1",
    launchDate: new Date("December 27,2030"),
    target: "Kepler-442 b",
    customers: ["ZTM","NASA"],
    upcoming:true,
    success: true
}

launches.set(launch.flightNumber, launch);

function existsLaunchWithId(launchId) {
    return launches.has(launchId);
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDB
    .findOne()
    .sort('-flightNumber');

    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function getAllLaunches() {
    // return Array.from(launches.values());
    return await launchesDB.find({},{
        '__v':0,
        '_id':0
    })
}

saveLaunch(launch);
async function saveLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target
    })

    if(!planet) {
        throw new Error('No matching planet is found');
    }

    await launchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },launch,{
        upsert:true
    })
}

async function schedualeNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber(launch)+1;
    
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['ZTM','NASA'],
        flightNumber: newFlightNumber
    })
    
    await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//     latestFlightNumber ++;
//     launches.set(
//         latestFlightNumber, 
//         Object.assign(launch, {
//             flightNumber:latestFlightNumber,
//             customers: ['ZTM', 'NASA'],
//             upcoming:true,
//             success:true
//         })
//     );
// }

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}

module.exports = {
    existsLaunchWithId,
    getAllLaunches,
    schedualeNewLaunch,
    abortLaunchById
}