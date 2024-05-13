import { useState } from "react";
import axios from "axios";

export default function CreateEvent({ closeModal }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showDisplayHours, setShowDisplayHours] = useState(true);

  const handlePasswordChange = (e: any) => {
    setShowPasswordInput(e.target.checked);
  };

  const handleDisplayHoursChange = (e: any) => {
    setShowDisplayHours(e.target.checked);
  };

  // Form submission logic
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!name || !startDate || !endDate) {
      setError("Please fill out all required fields.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after the start date.");
      return;
    }

    const periodData = {
      name,
      description,
      timePeriod: {
        start: startDate,
        end: endDate,
      },
      displayHours: showDisplayHours,
      hasPassword: showPasswordInput,
      eventPassword: showPasswordInput ? "password" : "",
    };

    console.log(periodData);

    try {
      const response = await axios.post("/api/periods", periodData);
      if (response.status === 201) {
        console.log("Period created successfully");
        closeModal();
      } else {
        setError("Failed to create the period.");
      }
    } catch (err) {
      setError("An error occurred while creating the period.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create Event</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Event Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="start-date" className="block text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="end-date" className="block text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                className="mr-2"
                onChange={handlePasswordChange}
              />
              Password
            </label>
          </div>
          {showPasswordInput && (
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium">
                Password{" "}
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full"
                disabled={!showPasswordInput}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium">
              <input
                type="checkbox"
                className="mr-2"
                defaultChecked
                onChange={handleDisplayHoursChange}
              />
              Shows hours
            </label>
          </div>

          {showDisplayHours && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Event hours will be displayed.
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 bg-gray-300 p-2 rounded"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
