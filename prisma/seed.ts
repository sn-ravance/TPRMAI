import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ============================================
// Resources and their CRUD permissions
// ============================================

const APP_RESOURCES = [
  'dashboard',
  'vendors',
  'assessments',
  'documents',
  'findings',
  'reports',
  'agents',
  'settings',
]

const SYSTEM_RESOURCES = ['users', 'roles']

const ACTIONS = ['view', 'create', 'edit', 'delete']

// ============================================
// System Roles and their permission levels
// ============================================

interface RoleDef {
  name: string
  description: string
  permissions: (resource: string, action: string) => boolean
}

const SYSTEM_ROLES: RoleDef[] = [
  {
    name: 'ADMIN',
    description: 'Full system access including user and role management',
    permissions: () => true, // all permissions
  },
  {
    name: 'ANALYST',
    description: 'Can manage vendors, assessments, findings, and reports',
    permissions: (resource, action) => {
      // Can do everything except user/role management
      if (resource === 'users' || resource === 'roles') return false
      return true
    },
  },
  {
    name: 'VIEWER',
    description: 'Read-only access to dashboards and reports',
    permissions: (_resource, action) => {
      if (['users', 'roles'].includes(_resource)) return false
      return action === 'view'
    },
  },
  {
    name: 'VENDOR',
    description: 'Limited access for external vendor contacts',
    permissions: (resource, action) => {
      // Vendors can view their own data and upload documents
      if (['dashboard', 'documents'].includes(resource)) return true
      if (['vendors', 'assessments', 'findings'].includes(resource))
        return action === 'view'
      return false
    },
  },
]

// ============================================
// Seed Users (match mock-oidc subjects)
// ============================================

const SEED_USERS = [
  {
    email: 'admin@tprmai.local',
    name: 'TPRM Administrator',
    oidcSubject: 'admin-001',
    roleName: 'ADMIN',
    department: 'Information Security',
  },
  {
    email: 'analyst@tprmai.local',
    name: 'Risk Analyst',
    oidcSubject: 'analyst-001',
    roleName: 'ANALYST',
    department: 'Third Party Risk Management',
  },
  {
    email: 'viewer@tprmai.local',
    name: 'Compliance Viewer',
    oidcSubject: 'viewer-001',
    roleName: 'VIEWER',
    department: 'Compliance',
  },
  {
    email: 'vendor@tprmai.local',
    name: 'Vendor Contact',
    oidcSubject: 'vendor-001',
    roleName: 'VENDOR',
    department: 'External',
  },
]

// ============================================
// Main Seed Function
// ============================================

async function main() {
  console.log('Seeding RBAC: roles, permissions, users...')

  // 1. Create all permissions
  const allResources = [...APP_RESOURCES, ...SYSTEM_RESOURCES]
  const permissionMap: Record<string, string> = {} // "resource.action" -> id

  for (const resource of allResources) {
    for (const action of ACTIONS) {
      const perm = await prisma.permission.upsert({
        where: { resource_action: { resource, action } },
        update: {},
        create: {
          resource,
          action,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
        },
      })
      permissionMap[`${resource}.${action}`] = perm.id
    }
  }

  console.log(`  Created ${Object.keys(permissionMap).length} permissions`)

  // 2. Create system roles with permission assignments
  const roleMap: Record<string, string> = {} // roleName -> id

  for (const roleDef of SYSTEM_ROLES) {
    const role = await prisma.role.upsert({
      where: { name: roleDef.name },
      update: { description: roleDef.description },
      create: {
        name: roleDef.name,
        description: roleDef.description,
        isSystem: true,
      },
    })
    roleMap[roleDef.name] = role.id

    // Clear existing permissions for this role and reassign
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })

    const grantedPermIds: string[] = []
    for (const resource of allResources) {
      for (const action of ACTIONS) {
        if (roleDef.permissions(resource, action)) {
          grantedPermIds.push(permissionMap[`${resource}.${action}`])
        }
      }
    }

    await prisma.rolePermission.createMany({
      data: grantedPermIds.map((pid) => ({
        roleId: role.id,
        permissionId: pid,
      })),
    })

    console.log(`  Role ${roleDef.name}: ${grantedPermIds.length} permissions`)
  }

  // 3. Create seed users (matching mock-oidc test users)
  for (const userDef of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: userDef.email },
      update: {
        name: userDef.name,
        oidcSubject: userDef.oidcSubject,
        roleId: roleMap[userDef.roleName],
      },
      create: {
        email: userDef.email,
        name: userDef.name,
        oidcSubject: userDef.oidcSubject,
        roleId: roleMap[userDef.roleName],
        department: userDef.department,
        lastLogin: new Date(),
      },
    })
    console.log(`  User: ${userDef.email} -> ${userDef.roleName}`)
  }

  // 4. Create sample vendors
  const vendors = [
    {
      name: 'Acme Cloud Services',
      industry: 'Cloud Computing',
      country: 'United States',
      stateProvince: 'California',
      primaryContactEmail: 'security@acme.example.com',
      status: 'ACTIVE',
    },
    {
      name: 'DataTech Solutions',
      industry: 'Data Analytics',
      country: 'United States',
      stateProvince: 'Texas',
      primaryContactEmail: 'contact@datatech.example.com',
      status: 'ACTIVE',
    },
    {
      name: 'SecurePayments Inc',
      industry: 'Financial Services',
      country: 'United States',
      stateProvince: 'New York',
      primaryContactEmail: 'security@securepay.example.com',
      status: 'PENDING',
    },
  ]

  for (const vendor of vendors) {
    await prisma.vendor.upsert({
      where: { id: vendor.name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: vendor,
    })
    console.log(`  Vendor: ${vendor.name}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
