from ai_agents.cpu_agent import analyze_cpu
from ai_agents.memory_agent import analyze_memory


def generate_insights():

    cpu_alerts = analyze_cpu()
    memory_alerts = analyze_memory()

    insights = []

    # Both CPU and Memory issues
    if cpu_alerts and memory_alerts:

        insights.append({
            "insight":
            "High traffic caused CPU spike in result-service."
        })

        insights.append({
            "insight":
            "Increased workload likely triggered higher memory consumption in grading-db-pod."
        })

        insights.append({
            "insight":
            "Application dependency chain suggests database pressure originated from result processing requests."
        })

        insights.append({
            "insight":
            "Current resource trend resembles a pre-scaling stress scenario."
        })

        insights.append({
            "insight":
            "Recommended action: Increase pod replicas and monitor database memory allocation."
        })

    # CPU only
    elif cpu_alerts:

        insights.append({
            "insight":
            "CPU spike detected in application workload."
        })

        insights.append({
            "insight":
            "Traffic volume appears significantly higher than baseline usage."
        })

        insights.append({
            "insight":
            "Pod may become unstable if CPU utilization continues increasing."
        })

        insights.append({
            "insight":
            "Recommended action: Enable Horizontal Pod Autoscaler."
        })

    # Memory only
    elif memory_alerts:

        insights.append({
            "insight":
            "Memory consumption is approaching critical levels."
        })

        insights.append({
            "insight":
            "Database caching or heavy query execution may be responsible."
        })

        insights.append({
            "insight":
            "Potential memory leak cannot be ruled out."
        })

        insights.append({
            "insight":
            "Recommended action: Review memory limits and optimize workloads."
        })

    # Healthy cluster
    else:

        insights.append({
            "insight":
            "System operating normally."
        })

        insights.append({
            "insight":
            "No abnormal CPU or memory patterns detected."
        })

        insights.append({
            "insight":
            "Cluster health is stable and resources are within safe limits."
        })

    return insights