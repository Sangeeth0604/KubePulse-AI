import os
from kubernetes import client, config

KUBE_AVAILABLE = False
v1 = None
custom_api = None


APP_POD_PREFIXES = (
    "student-login-service",
    "result-service",
    "fee-payment-service",
    "grading-db-pod",
)


def _load_kube_config() -> bool:
    try:
        config.load_kube_config()
        return True
    except Exception:
        return False


def _load_incluster_config() -> bool:
    try:
        config.load_incluster_config()
        return True
    except Exception:
        return False


def _ensure_clients() -> bool:
    global KUBE_AVAILABLE, v1, custom_api

    if v1 is not None and custom_api is not None:
        return True

    if "KUBERNETES_SERVICE_HOST" in os.environ:
        KUBE_AVAILABLE = _load_incluster_config() or _load_kube_config()
    else:
        KUBE_AVAILABLE = _load_kube_config() or _load_incluster_config()

    if not KUBE_AVAILABLE:
        v1 = None
        custom_api = None
        return False

    v1 = client.CoreV1Api()
    custom_api = client.CustomObjectsApi()
    return True


def _is_app_pod(pod_name: str) -> bool:
    return pod_name.startswith(APP_POD_PREFIXES)


def get_pods():
    if not _ensure_clients():
        return {"error": "Kubernetes configuration not available"}

    try:
        pods = v1.list_pod_for_all_namespaces(watch=False)
    except Exception as exc:
        return {"error": f"Failed to query Kubernetes pods: {exc}"}

    pod_list = []

    for pod in pods.items:
        name = pod.metadata.name

        if not _is_app_pod(name):
            continue

        pod_list.append({
            "name": name,
            "namespace": pod.metadata.namespace,
            "status": pod.status.phase,
            "node": pod.spec.node_name
        })

    return pod_list


def get_pod_metrics():
    if not _ensure_clients():
        return {"error": "Kubernetes configuration not available"}

    if custom_api is None:
        return {"error": "Kubernetes metrics API not available"}

    try:
        response = custom_api.list_cluster_custom_object(
            group="metrics.k8s.io",
            version="v1beta1",
            plural="pods"
        )
    except Exception as exc:
        return {"error": f"Failed to query Kubernetes metrics: {exc}"}

    metrics = []

    for item in response.get("items", []):
        pod_name = item.get("metadata", {}).get("name", "")

        if not _is_app_pod(pod_name):
            continue

        containers = item.get("containers", [])

        if not containers:
            continue

        usage = containers[0].get("usage", {})

        metrics.append({
            "pod": pod_name,
            "cpu": usage.get("cpu", "0"),
            "memory": usage.get("memory", "0")
        })

    return metrics