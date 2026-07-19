
# Before initializing Nx, create a `libs/shared` directory (or similar) to hold reusable code.

Store common libraries that will be shared across multiple services, for example:

- Middleware: `auth.js`, `errorHandler.js`, `rateLimiter.js`
- Utilities: `logger.js`, `constants.js`, `helpers.js`
- Services/Clients: `kafka.js`, `redis.js`, `email.js`

This avoids code duplication. Any changes made to a shared library are automatically available to all services that depend on it.
- For example:

libs/
├── auth
├── logger
├── config
├── kafka
└── shared-types

apps/
├── user-service
├── payment-service
├── transaction-service
└── notification-service
This is a common structure in Nx monorepos because it minimizes code duplication while keeping each microservice focused on its own business logic.

## In summary
Nx's biggest strength isn't just that it stores everything in one repository. It's that it understands the relationships between your applications and libraries.

**That enables features like**

- Code sharing through reusable libraries.
- Dependency tracking so Nx knows what depends on what.
- Affected commands that rebuild and retest only what's impacted.
- Consistent implementations across services.
- Faster CI/CD by avoiding unnecessary work.
- Simpler maintenance because you update shared code in one place instead of many.

So the libs/ folder isn't an Nx requirement—it's a design pattern that lets you get the most value from Nx's dependency analysis and build optimization


# Initializing Nx in a project
**command:"pnpm dlx nx@latest init"**

## make sure all NX package are same version
 **pnpm nx report**

### Install Nx plugins for your project
**Base (core/framework) plugins**
 - express
 - node
 - js :Plain JavaScript/TypeScript libraries
 - React
**Testing plugins**
 - vitest → Unit testing with Vitest
 - playwright → End-to-end (E2E) browser testing
 - Eslint- Code Quality
 - vite - Build and serve apps
 **command**
1. **Align plugin versions with Nx core**
   Upgrade all official plugins to match Nx 23:
   ```bash
2  **pnpm add -D @nx/react@23 @nx/vite@23 @nx/node@23 @nx/js@23 @nx/d@23 -w**
   **pnpm up -D @nx/* -w**


### genrating project graph
**COMMAND:pnpm nx graph**
 - **pnpm nx reset** 
 - **pnpm nx list**
 - **NX_DAEMON=false pnpm nx graph --verbose**


#### creates a React application in an Nx workspace.
link an e2e  with its webapp through implicit dependencies
**Command**
 pnpm nx generate @nx/react:application web \
  --projectName=web \
  --directory=services/web \
  --bundler=vite \
  --e2eTestRunner=playwright \
  --style=css \
  --routing=true

##### create node application in an NX work space and tool to packge them
this create standalone project.json file in each services, Nx point to that file and execute the test tools set for  the  application
in NX 23.1 version, no standalone project.json get createed  instead all test tools appear in nx.json in the root folder ,doing testing Nx pick tools from there

 **pnpm nx g @nx/node:application payment-service \--directory=services/payment-service**
 **pnpm nx g @nx/node:application notification-service \--directory=services/notification-service**
# [beause this is an establish project i dont need Nx to build from scrash]: so this stage will be skiped or ignored.

Since you already have the microservices, do not generate them again. We'll register each one with Nx.

We'll start with one service (payment-service). Once it works, you'll repeat the same process for the others.

### Creating project.json accross services
 # payment-service:
  -  cd fintech-platform/services/payment-service$ touch project.json
  - Initially put only the project name:
     {
        "name": "payment-service"
     }

  - Now run: 
    pnpm nx show projects




  - {
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "name": "payment-service",
  "projectType": "application",
  "sourceRoot": "services/payment-service/src",
  "targets": {}
   } 

 - pnpm nx show project payment-service
 - pnpm nx start payment-service
 - pnpm nx serve payment-service → starts your Express server.
 - pnpm nx lint payment-service → runs ESLint.
 - pnpm nx test payment-service → runs Jest.
 - pnpm nx build payment-service → runs your build command.

 # Api-gateway

 # fraud-service

 # mock-service

 # notification-service

 # transaction-service

 # user-service

 # walle-service

 ==========================
 ### ERROR HANDLING :[plugin versions confliting]
 --------------------pnpm nx g @nx/node:application payment-service \
  --directory=services/payment-service

 NX  Generating @nx/node:application

✔ Which framework do you want to use? · express
✔ What should be the project name and where should it be generated? · payment-service @ services/payment-service
Fetching prettier...

 NX   Cannot read properties of undefined (reading 'filter')

Pass --verbose to see the stacktrace.
------
## SOLUTION
------------------------

**pnpm nx report**
**pnpm remove @nrwl/express @nrwl/js @nrwl/react**
**pnpm add -Dw \@nx/node@23.1.0 \@nx/express@23.1.0 \@nx/jest@23.1.0 \@nx/linter@23.1.0**
**pnpm list @nx/node @nx/express @nx/jest @nx/devkit**[to verify whether the upgrade actually happened]
**pnpm install**

**OR**
- rm -rf node_modules
- rm pnpm-lock.yaml
- pnpm install
- pnpm nx reset
- pnpm nx report
- pnpm list nx @nx/devkit @nx/node @nx/jest @nx/js
- pnpm nx g @nx/node:application payment-service \ --directory=services/payment-service


The problem
Your workspace has mixed Nx versions.pnpm list @nx/node @nx/express @nx/jest @nx/devkit
You have:
nx                  23.1.0   ✅
@nx/react           23.1.0   ✅
@nx/vite            23.1.0   ✅
@nx/playwright      23.1.0   ✅

but also:
@nx/node            19.8.4   ❌
@nx/express         19.8.4   ❌
@nx/jest            19.8.4   ❌
@nx/linter          19.8.4   ❌

T
-----------------------------------------
## Connecting Workspace to Nx Cloud
-------------------------------------------
to benefit from alot of features such as caching and Ci they usually the pain point come in
Nx come with a commersial addon which is a products ,Nx cloud 

- we can use Nx cloud to set up Ci for remote caching
- we can use it to distribute task paralyze them for mush faster which is called NX agents

**Commands**
- pnpm nx  connect [run from local repo after been push to github]
- 
