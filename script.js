// State management
let rooms = [];
const TOTAL_FLOORS = 10;

// Initialize hotel rooms
function initializeRooms() {
    rooms = [];
    for (let floor = 1; floor <= 10; floor++) {
        const roomsOnFloor = floor === 10 ? 7 : 10;
        for (let idx = 0; idx < roomsOnFloor; idx++) {
            rooms.push({
                number: floor * 100 + (idx + 1),
                floor: floor,
                index: idx,
                status: 'available' // 'available', 'booked', 'newly-booked'
            });
        }
    }
    renderHotel();
}

// Distance calculation
function getDistance(roomA, roomB) {
    if (roomA.floor === roomB.floor) {
        return Math.abs(roomA.index - roomB.index);
    } else {
        return roomA.index + roomB.index + Math.abs(roomA.floor - roomB.floor) * 2;
    }
}

// DOM Elements
const hotelGrid = document.getElementById('hotel-grid');
const logOutput = document.getElementById('log-output');
const inputRoomCount = document.getElementById('room-count');

// Render the hotel visualization
function renderHotel() {
    hotelGrid.innerHTML = '';
    
    // Render floors top to bottom (10 to 1)
    for (let floor = 10; floor >= 1; floor--) {
        const floorRooms = rooms.filter(r => r.floor === floor);
        if (floorRooms.length === 0) continue;

        const row = document.createElement('div');
        row.className = 'floor-row';

        const lift = document.createElement('div');
        lift.className = 'lift-shaft';
        lift.innerHTML = `Floor ${floor}`;
        row.appendChild(lift);

        const roomsContainer = document.createElement('div');
        roomsContainer.className = 'rooms-wrapper';
        
        floorRooms.forEach(room => {
            const roomEl = document.createElement('div');
            roomEl.className = `room ${room.status}`;
            roomEl.textContent = room.number;
            roomEl.title = `Room ${room.number} (Floor ${room.floor})`;
            roomsContainer.appendChild(roomEl);
        });

        // Add dummy placeholders to align floor 10
        if (floorRooms.length < 10) {
            for(let i = floorRooms.length; i < 10; i++) {
                const dummy = document.createElement('div');
                dummy.style.flex = "1";
                dummy.style.visibility = "hidden";
                roomsContainer.appendChild(dummy);
            }
        }

        row.appendChild(roomsContainer);
        hotelGrid.appendChild(row);
    }
}

// Clear 'newly-booked' status to regular 'booked'
function clearNewlyBooked() {
    rooms.forEach(r => {
        if (r.status === 'newly-booked') r.status = 'booked';
    });
}

// Update log
function logMsg(msg, isError = false) {
    logOutput.innerHTML = msg;
    logOutput.style.color = isError ? '#dc2626' : 'var(--text-main)';
}

// Booking logic
function bookRooms(count) {
    if (count < 1 || count > 5) {
        logMsg("Please enter a valid number of rooms (1-5).", true);
        return;
    }

    const availableRooms = rooms.filter(r => r.status === 'available');
    if (availableRooms.length < count) {
        logMsg(`Booking failed. Only ${availableRooms.length} rooms available.`, true);
        return;
    }

    clearNewlyBooked();

    let selectedRooms = [];
    let bestTravelTime = Infinity;

    // 1. Try to find rooms on the SAME floor first
    let singleFloorFound = false;

    for (let floor = 1; floor <= 10; floor++) {
        const floorAvail = availableRooms.filter(r => r.floor === floor);
        if (floorAvail.length >= count) {
            singleFloorFound = true;
            // Iterate through windows of size 'count'
            for (let i = 0; i <= floorAvail.length - count; i++) {
                const windowRooms = floorAvail.slice(i, i + count);
                // Travel time on same floor is distance between first and last in the window
                const first = windowRooms[0];
                const last = windowRooms[windowRooms.length - 1];
                const time = getDistance(first, last);
                
                if (time < bestTravelTime) {
                    bestTravelTime = time;
                    selectedRooms = windowRooms;
                }
            }
        }
    }

    // 2. Fallback: DP for multi-floor if no single floor has enough rooms
    if (!singleFloorFound) {
        // We want to select `count` rooms from `availableRooms` to minimize 
        // the sum of adjacent distances.
        const N = count;
        const V = availableRooms.length;
        
        // dp[i][k] = min cost ending at available room 'i' picking 'k' rooms.
        const dp = Array(V).fill(null).map(() => Array(N + 1).fill(Infinity));
        const prev = Array(V).fill(null).map(() => Array(N + 1).fill(-1));

        // Base case: k=1
        for (let i = 0; i < V; i++) {
            dp[i][1] = 0;
        }

        // DP transitions
        for (let k = 2; k <= N; k++) {
            for (let i = 0; i < V; i++) {
                for (let j = 0; j < i; j++) {
                    const dist = getDistance(availableRooms[j], availableRooms[i]);
                    if (dp[j][k-1] + dist < dp[i][k]) {
                        dp[i][k] = dp[j][k-1] + dist;
                        prev[i][k] = j;
                    }
                }
            }
        }

        // Find the best endpoint
        let bestEndpoint = -1;
        bestTravelTime = Infinity;
        for (let i = 0; i < V; i++) {
            if (dp[i][N] < bestTravelTime) {
                bestTravelTime = dp[i][N];
                bestEndpoint = i;
            }
        }

        // Reconstruct path
        let curr = bestEndpoint;
        let currK = N;
        const path = [];
        while(curr !== -1 && currK > 0) {
            path.push(availableRooms[curr]);
            curr = prev[curr][currK];
            currK--;
        }
        selectedRooms = path.reverse();
    }

    // Apply booking
    selectedRooms.forEach(sr => {
        const room = rooms.find(r => r.number === sr.number);
        if (room) room.status = 'newly-booked';
    });

    renderHotel();
    
    const roomNumbers = selectedRooms.map(r => r.number).join(', ');
    logMsg(`✅ Successfully allocated ${count} room(s): <strong>${roomNumbers}</strong>. <br><small style="color:var(--text-muted)">Calculated Travel Time: ${bestTravelTime} minutes.</small>`);
}

// Generate random occupancy
function generateRandom() {
    clearNewlyBooked();
    let occupiedCount = 0;
    rooms.forEach(r => {
        // ~60% chance to be occupied
        if (Math.random() < 0.6) {
            r.status = 'booked';
            occupiedCount++;
        } else {
            r.status = 'available';
        }
    });
    renderHotel();
    logMsg(`Random occupancy generated. ${occupiedCount}/97 rooms are currently occupied.`);
}

// Reset booking
function resetBooking() {
    rooms.forEach(r => {
        r.status = 'available';
    });
    renderHotel();
    logMsg("All rooms have been reset to available.");
}

// Event Listeners
document.getElementById('btn-book').addEventListener('click', () => {
    const count = parseInt(inputRoomCount.value);
    bookRooms(count);
});

document.getElementById('btn-random').addEventListener('click', generateRandom);
document.getElementById('btn-reset').addEventListener('click', resetBooking);

// Init
initializeRooms();
