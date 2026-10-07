from ai_agents.cpu_agent import analyze_cpu
from ai_agents.memory_agent import analyze_memory
from ai_agents.prediction_agent import predict_risk


def generate_recommendations():
    cpu_alerts = analyze_cpu()
    memory_alerts = analyze_memory()
    predictions = predict_risk()

    recommendations = []

    if cpu_alerts:
        recommendations.append("Scale result-service from 1 replica to 2 replicas.")
        recommendations.append("Enable Horizontal Pod Autoscaler for result-service.")

    if memory_alerts:
        recommendations.append("Monitor grading-db-pod memory allocation.")
        recommendations.append("Review database query load and memory limits.")

    if predictions:
        recommendations.append("Investigate traffic spike source before instability occurs.")

    if not recommendations:
        recommendations.append("No remediation needed. Cluster is operating normally.")

    return {
        "priority": "HIGH" if cpu_alerts or memory_alerts or predictions else "LOW",
        "recommendations": recommendations
    }