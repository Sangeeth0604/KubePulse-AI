from metrics.k8s_metrics import get_pod_metrics

def analyze_memory():

    metrics = get_pod_metrics()

    alerts = []

    if isinstance(metrics, dict) and "error" in metrics:
        return metrics

    for pod in metrics:
        if not pod.get("pod", "").startswith(("result", "student", "grading", "fee")):
            continue

        memory_raw = pod["memory"]

        # Convert memory values
        if "Mi" in memory_raw:
            memory_value = int(memory_raw.replace("Mi", ""))

        elif "Ki" in memory_raw:
            memory_value = int(memory_raw.replace("Ki", "")) // 1024

        else:
            memory_value = 0

        # Threshold for demo
        if memory_value > 100:

            alerts.append({
                "pod": pod["pod"],
                "memory": memory_raw,
                "alert": "High Memory Usage Detected"
            })

    return alerts