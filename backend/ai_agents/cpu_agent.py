from metrics.k8s_metrics import get_pod_metrics

def analyze_cpu():
    metrics = get_pod_metrics()

    alerts = []

    # Check if metrics returned error
    if isinstance(metrics, dict) and "error" in metrics:
        return metrics

    def cpu_to_millicores(cpu_str):
        if not cpu_str:
            return None
        try:
            s = str(cpu_str).strip()
            if s.endswith("n"):
                # nanocores -> millicores
                return int(int(s[:-1]) / 1_000_000)
            if s.endswith("u"):
                return int(int(s[:-1]) / 1000)
            if s.endswith("m"):
                return int(s[:-1])
            # plain cores (e.g. "1" or "0.5") -> cores to millicores
            return int(float(s) * 1000)
        except Exception:
            return None

    # threshold in millicores (e.g., 500m = 0.5 core)
    THRESHOLD_M = 500

    for pod in metrics:
        if not pod.get("pod", "").startswith(("result", "student", "grading", "fee")):
            continue

        cpu_raw = pod.get("cpu")
        cpu_m = cpu_to_millicores(cpu_raw)
        if cpu_m is None:
            continue
        if cpu_m >= THRESHOLD_M:
            alerts.append({
                "pod": pod.get("pod"),
                "cpu": cpu_raw,
                "cpu_m": cpu_m,
                "alert": "High CPU Usage"
            })

    return alerts