"use client"

import { useState } from "react"
import { BarChart2, Calendar, Clock, Download, Filter, LineChart, PieChart, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/Card"
import PageHeader from "../components/PageHeader"
import "../style/Insights.css"

function Insights() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="insights-page">
      <PageHeader
        title="Writing Insights"
        description="Analyze your writing patterns, productivity, and progress"
        icon={BarChart2}
      />

      <div className="insights-actions">
        <div className="time-selector">
          <button className={`time-button ${timeRange === "24h" ? "active" : ""}`} onClick={() => setTimeRange("24h")}>
            24h
          </button>
          <button className={`time-button ${timeRange === "7d" ? "active" : ""}`} onClick={() => setTimeRange("7d")}>
            7 Days
          </button>
          <button className={`time-button ${timeRange === "30d" ? "active" : ""}`} onClick={() => setTimeRange("30d")}>
            30 Days
          </button>
          <button className={`time-button ${timeRange === "90d" ? "active" : ""}`} onClick={() => setTimeRange("90d")}>
            90 Days
          </button>
        </div>

        <div className="insights-buttons">
          <button className="insights-button">
            <Filter className="button-icon" />
            <span>Filter</span>
          </button>
          <button className="insights-button">
            <Download className="button-icon" />
            <span>Export</span>
          </button>
          <button className="insights-button icon-only">
            <RefreshCw className="button-icon" />
          </button>
        </div>
      </div>

      <div className="insights-overview">
        <div className="insight-stat-card">
          <div className="stat-icon-container">
            <LineChart className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">5,302</div>
            <div className="stat-label">Words this week</div>
          </div>
          <div className="stat-change positive">+12% from last week</div>
        </div>

        <div className="insight-stat-card">
          <div className="stat-icon-container">
            <Clock className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">14.5</div>
            <div className="stat-label">Hours writing</div>
          </div>
          <div className="stat-change positive">+3.2 hours from last week</div>
        </div>

        <div className="insight-stat-card">
          <div className="stat-icon-container">
            <Calendar className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">5/7</div>
            <div className="stat-label">Days active</div>
          </div>
          <div className="stat-change negative">-1 day from last week</div>
        </div>

        <div className="insight-stat-card">
          <div className="stat-icon-container">
            <BarChart2 className="stat-icon" />
          </div>
          <div className="stat-content">
            <div className="stat-value">366</div>
            <div className="stat-label">Words per hour</div>
          </div>
          <div className="stat-change negative">-24 from last week</div>
        </div>
      </div>

      <div className="insights-charts">
        <Card className="word-count-chart">
          <CardHeader>
            <CardTitle icon={LineChart}>Word Count Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="chart-container">
              <div className="chart-placeholder">
                <div className="chart-y-axis">
                  <div className="y-axis-label">1000</div>
                  <div className="y-axis-label">750</div>
                  <div className="y-axis-label">500</div>
                  <div className="y-axis-label">250</div>
                  <div className="y-axis-label">0</div>
                </div>
                <div className="chart-content">
                  <div className="chart-grid">
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                    <div className="grid-line"></div>
                  </div>
                  <div className="line-chart">
                    <svg viewBox="0 0 700 300" className="chart-svg">
                      <path
                        d="M50,250 L150,180 L250,220 L350,120 L450,150 L550,80 L650,100"
                        className="chart-line"
                        fill="none"
                        strokeWidth="3"
                      />
                      <path
                        d="M50,250 L150,180 L250,220 L350,120 L450,150 L550,80 L650,100"
                        className="chart-line-area"
                        fill="url(#gradient)"
                        strokeWidth="0"
                        opacity="0.2"
                      />
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                      <circle cx="50" cy="250" r="5" className="data-point" />
                      <circle cx="150" cy="180" r="5" className="data-point" />
                      <circle cx="250" cy="220" r="5" className="data-point" />
                      <circle cx="350" cy="120" r="5" className="data-point" />
                      <circle cx="450" cy="150" r="5" className="data-point" />
                      <circle cx="550" cy="80" r="5" className="data-point" />
                      <circle cx="650" cy="100" r="5" className="data-point" />
                    </svg>
                  </div>
                  <div className="chart-x-axis">
                    <div className="x-axis-label">Mon</div>
                    <div className="x-axis-label">Tue</div>
                    <div className="x-axis-label">Wed</div>
                    <div className="x-axis-label">Thu</div>
                    <div className="x-axis-label">Fri</div>
                    <div className="x-axis-label">Sat</div>
                    <div className="x-axis-label">Sun</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="insights-secondary-charts">
          <Card className="productivity-chart">
            <CardHeader>
              <CardTitle icon={Clock}>Productivity by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar-container">
                      <div className="bar-label">Morning</div>
                      <div className="bar-wrapper">
                        <div className="bar" style={{ height: "40%" }}></div>
                      </div>
                      <div className="bar-value">1,245</div>
                    </div>
                    <div className="bar-container">
                      <div className="bar-label">Afternoon</div>
                      <div className="bar-wrapper">
                        <div className="bar" style={{ height: "25%" }}></div>
                      </div>
                      <div className="bar-value">780</div>
                    </div>
                    <div className="bar-container">
                      <div className="bar-label">Evening</div>
                      <div className="bar-wrapper">
                        <div className="bar" style={{ height: "85%" }}></div>
                      </div>
                      <div className="bar-value">2,640</div>
                    </div>
                    <div className="bar-container">
                      <div className="bar-label">Night</div>
                      <div className="bar-wrapper">
                        <div className="bar" style={{ height: "20%" }}></div>
                      </div>
                      <div className="bar-value">637</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="content-distribution">
            <CardHeader>
              <CardTitle icon={PieChart}>Content Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <div className="pie-chart">
                    <svg viewBox="0 0 100 100" className="pie-svg">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#06b6d4"
                        strokeWidth="20"
                        strokeDasharray="75.4 175.9"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#0ea5e9"
                        strokeWidth="20"
                        strokeDasharray="50.3 175.9"
                        strokeDashoffset="-75.4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#8b5cf6"
                        strokeWidth="20"
                        strokeDasharray="37.7 175.9"
                        strokeDashoffset="-125.7"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#ec4899"
                        strokeWidth="20"
                        strokeDasharray="12.5 175.9"
                        strokeDashoffset="-163.4"
                      />
                    </svg>
                    <div className="pie-legend">
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: "#06b6d4" }}></div>
                        <div className="legend-label">Dialogue (30%)</div>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: "#0ea5e9" }}></div>
                        <div className="legend-label">Description (20%)</div>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: "#8b5cf6" }}></div>
                        <div className="legend-label">Action (15%)</div>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color" style={{ backgroundColor: "#ec4899" }}></div>
                        <div className="legend-label">Exposition (5%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="insights-details">
        <Card className="ai-usage-insights">
          <CardHeader>
            <CardTitle icon={BarChart2}>AI Assistant Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="ai-usage-stats">
              <div className="ai-stat">
                <div className="ai-stat-value">42</div>
                <div className="ai-stat-label">AI Suggestions Used</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-value">18%</div>
                <div className="ai-stat-label">Content AI-Enhanced</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-value">12</div>
                <div className="ai-stat-label">Rewrites Requested</div>
              </div>
            </div>
            <div className="ai-usage-chart">
              <div className="chart-placeholder">
                <div className="stacked-bar-chart">
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Mon</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "15%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "10%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Tue</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "20%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "5%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Wed</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "10%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "15%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Thu</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "25%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "10%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Fri</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "15%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "20%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Sat</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "5%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "5%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                  <div className="stacked-bar-container">
                    <div className="stacked-bar-label">Sun</div>
                    <div className="stacked-bar-wrapper">
                      <div className="stacked-bar-segment" style={{ height: "10%", backgroundColor: "#06b6d4" }}></div>
                      <div className="stacked-bar-segment" style={{ height: "5%", backgroundColor: "#0ea5e9" }}></div>
                    </div>
                  </div>
                </div>
                <div className="stacked-bar-legend">
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#06b6d4" }}></div>
                    <div className="legend-label">Suggestions</div>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: "#0ea5e9" }}></div>
                    <div className="legend-label">Rewrites</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Insights
