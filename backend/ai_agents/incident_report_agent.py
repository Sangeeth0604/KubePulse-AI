from ai_agents.cpu_agent import analyze_cpu
from ai_agents.memory_agent import analyze_memory
from ai_agents.prediction_agent import predict_risk
from ai_agents.risk_score_agent import calculate_risk_score


def generate_incident_report():
    cpu_alerts = analyze_cpu()
    memory_alerts = analyze_memory()
    predictions = predict_risk()
    risk_score = calculate_risk_score()

    has_incident = (
        len(cpu_alerts) > 0
        or len(memory_alerts) > 0
        or len(predictions) > 0
    )

    if not has_incident:
        return {
            "incident_id": "CP-2026-000",
            "severity": "LOW",
            "title": "No Active Incident",
            "root_cause": "No abnormal CPU, memory, or dependency behavior detected.",
            "impact": "Cluster is operating normally.",
            "recommended_resolution": "Continue monitoring cluster health.",
            "risk_score": risk_score.get("overall_risk", 0),
            "status": "Resolved"
        }

    return {
        "incident_id": "CP-2026-001",
        "severity": "HIGH",
        "title": "Resource Stress Detected in Application Dependency Chain",
        "root_cause": (
            "High incoming workload increased CPU utilization on result-service. "
            "This likely propagated pressure to grading-db-pod memory usage through "
            "the application dependency chain."
        ),
        "impact": (
            "result-service is under high CPU pressure and grading-db-pod is showing "
            "elevated memory usage. Without scaling, the application may become unstable."
        ),
        "recommended_resolution": (
            "Scale result-service replicas, enable Horizontal Pod Autoscaler, "
            "monitor grading-db-pod memory allocation, and investigate the traffic spike source."
        ),
        "risk_score": risk_score.get("overall_risk", 0),
        "status": "Active"
    }