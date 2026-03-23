terraform {
  cloud {
    organization = "personal-deployment"

    workspaces {
      name = "life-ping"
    }
  }

  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
    local = {
      source = "hashicorp/local"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "local_file" "env_file" {
  filename = "../.env"

  content = <<EOF
# Drizzle Env
CLOUDFLARE_ACCOUNT_ID=${var.account_id}
CLOUDFLARE_D1_TOKEN=${var.cloudflare_api_token}
CLOUDFLARE_DATABASE_ID=${cloudflare_d1_database.db.id}

# Worker Env
API_SECRET=${var.api_secret}
RESEND_API_KEY=${var.resend_api_key}
VAPID_PUBLIC_KEY=${var.vapid_public_key}
VAPID_PRIVATE_KEY=${var.vapid_private_key}
EOF
}

# -----------------------------
# KV Namespace
# -----------------------------

resource "cloudflare_workers_kv_namespace" "life_ping_kv" {
  account_id = var.account_id
  title      = "life-ping-kv"
}

# -----------------------------
# D1 Database
# -----------------------------

resource "cloudflare_d1_database" "db" {
  account_id = var.account_id
  name       = "life-ping-d1"

  read_replication = {
    mode = "disabled"
  }
}

# -----------------------------
# Worker
# -----------------------------

resource "cloudflare_worker" "worker" {
  account_id = var.account_id
  name       = "life-ping-worker"

  observability = {
    enabled            = true
    head_sampling_rate = 1
  }

  subdomain = {
    enabled          = true
    previews_enabled = true
  }
}

# -----------------------------
# Worker version (upload code)
# -----------------------------

resource "cloudflare_worker_version" "version" {
  account_id          = var.account_id
  worker_id           = cloudflare_worker.worker.id
  compatibility_date  = "2026-03-11"
  compatibility_flags = ["nodejs_compat"]

  main_module = "index.mjs"

  modules = [
    {
      name         = "index.mjs"
      content_type = "application/javascript+module"
      content_file = "../dist/index.js"
    }
  ]

  bindings = [
    {
      name = "API_SECRET"
      type = "secret_text"
      text = var.api_secret
    },
    {
      name = "RESEND_API_KEY"
      type = "secret_text"
      text = var.resend_api_key
    },
    {
      name = "VAPID_PUBLIC_KEY"
      type = "secret_text"
      text = var.vapid_public_key
    },
    {
      name = "VAPID_PRIVATE_KEY"
      type = "secret_text"
      text = var.vapid_private_key
    },
    {
      name         = "KV"
      type         = "kv_namespace"
      namespace_id = cloudflare_workers_kv_namespace.life_ping_kv.id
    },
    {
      name = "D1_DB"
      type = "d1"
      id   = cloudflare_d1_database.db.id
    }
  ]
}

# -----------------------------
# Cron Trigger
# -----------------------------

resource "cloudflare_workers_cron_trigger" "cron" {
  account_id  = var.account_id
  script_name = cloudflare_worker.worker.name
  schedules = [
    {
      cron = "0 */12 * * *"
    },
    {
      cron = "0 */6 * * *"
    },
  ]
  depends_on = [cloudflare_workers_deployment.deployment]
}

# -----------------------------
# Deployment
# -----------------------------

resource "cloudflare_workers_deployment" "deployment" {
  account_id  = var.account_id
  script_name = cloudflare_worker.worker.name
  strategy    = "percentage"

  versions = [
    {
      version_id = cloudflare_worker_version.version.id
      percentage = 100
    }
  ]
}
