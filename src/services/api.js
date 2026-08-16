// src/services/api.js
// Centralized API Service Layer for RailCare AI
// In Phase 1-9, this returns Promise-wrapped mock data.
// In Phase 10, these functions can be directly swapped to use real fetch() endpoints.

import {
  mockComplaints,
  mockIncidents,
  mockOfficers,
  mockDashboardStats,
  mockAnalyticsData
} from '../data/mockData';

// Simulated delay helper for realistic network/AI processing vibes
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // -------------------------------------------------------------
  // PASSENGER / COMPLAINT APIS
  // -------------------------------------------------------------

  /**
   * Simulates AI analysis of a complaint draft before submission
   */
  async analyzeComplaintDraft(data) {
    await delay(1200); // give the user an intelligent AI analysis feedback feel

    const descLower = (data.description || "").toLowerCase();
    const isAC = descLower.includes("ac") || descLower.includes("hot") || descLower.includes("cool") || descLower.includes("heat");
    const isWater = descLower.includes("water") || descLower.includes("toilet") || descLower.includes("tap") || descLower.includes("wash");
    const isDoor = descLower.includes("door") || descLower.includes("bogie") || descLower.includes("wheel") || descLower.includes("smoke");

    let category = "General";
    let priority = "MEDIUM";
    let confidence = 92;
    let aiReasoning = [];

    if (isAC) {
      category = "Electrical";
      priority = "HIGH";
      confidence = 94;
      aiReasoning = [
        "HVAC thermal / airflow disruption pattern detected",
        `Coach ${data.coach || "B4"} isolated in current train segment`,
        "Matches active emerging cluster pattern in RailCare DB",
        "High passenger discomfort probability during transit"
      ];
    } else if (isWater) {
      category = "Housekeeping";
      priority = "MEDIUM";
      confidence = 91;
      aiReasoning = [
        "Water outage keywords detected",
        "Recommended for next watering station scheduling"
      ];
    } else if (isDoor) {
      category = "Mechanical";
      priority = "HIGH";
      confidence = 95;
      aiReasoning = [
        "Mechanical hardware / door safety hazard detected",
        "High priority carriage & wagon inspection trigger"
      ];
    } else {
      category = "General / Grievance";
      priority = "LOW";
      confidence = 88;
      aiReasoning = ["Standard priority service request"];
    }

    return {
      issue: isAC ? "HVAC Malfunction / Extreme Temperature" : (isWater ? "Restroom Water Depletion" : "General Service Disruption"),
      category,
      priority,
      confidence,
      train: data.trainNumber || "12124",
      coach: data.coach || "B4",
      seat: data.seat || "34",
      aiReasoning,
      matchedIncidentId: isAC && data.coach?.toUpperCase() === "B4" ? "INC-108" : null
    };
  },

  /**
   * Submits a new complaint into the system
   */
  async submitComplaint(complaintData) {
    await delay(600);
    const newId = `RM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      id: newId,
      incidentId: complaintData.matchedIncidentId || (complaintData.coach === "B4" ? "INC-108" : null),
      trainNumber: complaintData.trainNumber || "12124",
      trainName: "Deccan Queen Express",
      coach: complaintData.coach || "B4",
      seat: complaintData.seat || "34",
      pnr: complaintData.pnr || "4521890199",
      passengerName: complaintData.passengerName || "Passenger",
      phone: complaintData.phone || "+91 98000 00000",
      channel: complaintData.channel || "Text",
      description: complaintData.description,
      category: complaintData.category || "Electrical",
      priority: complaintData.priority || "HIGH",
      status: "UNDER_INVESTIGATION",
      createdAt: new Date().toISOString(),
      aiConfidence: complaintData.confidence || 94,
      aiReasoning: complaintData.aiReasoning || ["Real-time AI classified"],
      timeline: [
        { step: "Complaint Registered", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "completed", note: "Logged via RailCare Portal" },
        { step: "AI Analysed & Clustered", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: "completed", note: "Clustered into INC-108 (Confidence 94%)" },
        { step: "Department Assigned", time: "Pending", status: "in_progress", note: "Routing to Divisional Supervisor" },
        { step: "Technician Dispatched", time: "--", status: "pending", note: "Pending officer acceptance" },
        { step: "Issue Resolved", time: "--", status: "pending", note: "Pending ground verification" }
      ]
    };

    // Prepend to local collection
    mockComplaints.unshift(newComplaint);
    return newComplaint;
  },

  /**
   * Retrieves a single complaint by ID or PNR
   */
  async getComplaint(id) {
    await delay(300);
    const cleanId = id.trim().toUpperCase();
    const found = mockComplaints.find(
      (c) => c.id.toUpperCase() === cleanId || c.pnr === cleanId
    );
    if (!found) {
      // Fallback demo complaint if user searches for anything else
      return mockComplaints[0];
    }
    return found;
  },

  /**
   * Retrieves all complaints with optional filtering
   */
  async getComplaints(filter = {}) {
    await delay(400);
    let results = [...mockComplaints];

    if (filter.priority && filter.priority !== "ALL") {
      results = results.filter((c) => c.priority === filter.priority);
    }
    if (filter.status && filter.status !== "ALL") {
      results = results.filter((c) => c.status === filter.status);
    }
    if (filter.category && filter.category !== "ALL") {
      results = results.filter((c) => c.category === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.trainNumber.toLowerCase().includes(q) ||
          c.coach.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  // -------------------------------------------------------------
  // ADMIN & INCIDENT APIS
  // -------------------------------------------------------------

  /**
   * Retrieves high-level dashboard metrics
   */
  async getDashboardStats() {
    await delay(300);
    return mockDashboardStats;
  },

  /**
   * Retrieves all clustered incidents
   */
  async getIncidents() {
    await delay(400);
    return mockIncidents;
  },

  /**
   * Retrieves a single incident by ID
   */
  async getIncident(id) {
    await delay(350);
    const found = mockIncidents.find((inc) => inc.id.toUpperCase() === id.toUpperCase());
    if (!found) {
      return mockIncidents[0]; // fallback to INC-108
    }

    // Populate related complaint details
    const related = mockComplaints.filter((c) => c.incidentId === found.id);
    return {
      ...found,
      relatedComplaintsList: related
    };
  },

  /**
   * Retrieves recommended officers for an incident
   */
  async getRecommendedOfficers(incidentId, department = "Electrical") {
    await delay(400);
    return mockOfficers;
  },

  /**
   * Assigns an officer to an incident
   */
  async assignOfficer(incidentId, officerId) {
    await delay(500);
    const incident = mockIncidents.find((i) => i.id === incidentId);
    const officer = mockOfficers.find((o) => o.id === officerId);

    if (incident && officer) {
      incident.assignedOfficer = {
        id: officer.id,
        name: officer.name,
        role: officer.role,
        department: officer.department,
        distance: officer.distance,
        matchScore: officer.matchScore,
        status: "Dispatched"
      };
      incident.status = "ASSIGNED";
    }

    return { success: true, incident, officer };
  },

  /**
   * Updates incident status (e.g. mark resolved or escalate)
   */
  async updateIncidentStatus(incidentId, status) {
    await delay(400);
    const incident = mockIncidents.find((i) => i.id === incidentId);
    if (incident) {
      incident.status = status;
    }
    return incident;
  },

  /**
   * Retrieves analytics data for charts and AI insights
   */
  async getAnalyticsData() {
    await delay(500);
    return mockAnalyticsData;
  }
};
