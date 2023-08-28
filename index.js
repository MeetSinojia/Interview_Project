// Import necessary modules and libraries
const app = require("express")(); // Express framework for creating HTTP server
const server = require("http").createServer(app); // Create HTTP server using Express app
const cors = require("cors"); // Middleware for handling Cross-Origin Resource Sharing (CORS)
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"], // Define allowed HTTP methods for CORS
	},
});

app.use(cors()); // Use CORS middleware for enabling cross-origin requests

const PORT = process.env.PORT || 5000; // Define the port for the server to listen on

// Define a simple route to check if the server is running
app.get("/", (req, res) => {
	res.send("Running");
});

// Socket.IO event listeners
io.on("connection", (socket) => {
	// When a user connects, emit their unique socket ID to them
	socket.emit("me", socket.id);

	// Listen for disconnect event and broadcast to other users that the call has ended
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded");
	});

	// Listen for a "callUser" event, which initiates a call to another user
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		// Emit the "callUser" event to the user being called, along with signal and caller's info
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	// Listen for an "answerCall" event, which indicates that a call has been accepted
	socket.on("answerCall", (data) => {
		// Emit the "callAccepted" event to the caller, passing the signal data
		io.to(data.to).emit("callAccepted", data.signal);
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
