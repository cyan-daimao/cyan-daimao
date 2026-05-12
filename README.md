<div align="center">

<!-- 动态打字效果标题 -->
<a href="https://github.com/cyan-daimao">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=700&size=32&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=Hi+%F0%9F%91%8B%2C+I'm+cyan-daimao;Data+Platform+Architect;Lakehouse+%7C+CDC+%7C+BI;Building+the+Future+of+Data" alt="Typing SVG" />
</a>

<br><br>

<!-- 状态徽章 -->
<a href="https://github.com/cyan-daimao">
  <img src="https://img.shields.io/badge/Focus-Data%20Platform-6366F1?style=flat-square" alt="Focus" />
</a>
<a href="https://github.com/cyan-daimao?tab=followers">
  <img src="https://img.shields.io/github/followers/cyan-daimao?label=Followers&style=flat-square&color=22d3ee" alt="Followers" />
</a>
<a href="https://github.com/cyan-daimao?tab=repositories">
  <img src="https://img.shields.io/badge/Repos-16+-f472b6?style=flat-square" alt="Repos" />
</a>

<br><br>

🏗️ **数据中台架构师** | 🏔️ **Lakehouse 实践者** | 🔗 **实时数据链路**

致力于打造**湖仓一体、存算分离**的企业级数据平台，覆盖从数据采集到智能分析的全链路。

<br>

<!-- 社交链接 -->
<a href="https://github.com/cyan-daimao">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
</a>
&nbsp;
<a href="https://cyan-daimao.github.io">
  <img src="https://img.shields.io/badge/Portfolio-6366F1?style=for-the-badge&logo=About.me&logoColor=white" alt="Portfolio" />
</a>

</div>

---

## 🏗️ 数据平台全景

> 一个覆盖 **数据采集 → 存储治理 → 计算分析 → 智能应用** 的完整数据中台

```mermaid
flowchart TB
    subgraph L1["📥 数据采集层"]
        D1["MySQL"]
        D2["Debezium"]
        D3["Kafka"]
        D4["Flink CDC"]
    end

    subgraph L2["🏔️ 湖仓存储层"]
        S1["RustFS<br/>对象存储"]
        S2["Iceberg<br/>表格式"]
        S3["REST Catalog"]
        S4["Gravitino<br/>元数据"]
    end

    subgraph L3["⚡ 计算引擎层"]
        C1["Spark"]
        C2["Flink"]
        C3["StarRocks"]
    end

    subgraph L4["🛡️ 数据服务层"]
        SVC1["DataGateway<br/>统一SQL入口"]
        SVC2["DataAuth<br/>权限管控"]
        SVC3["DataWorks<br/>调度血缘"]
    end

    subgraph L5["📊 数据应用层"]
        A1["DataMetric<br/>指标平台"]
        A2["DataBI<br/>智能分析/ChatBI"]
    end

    D1 --> D2 --> D3 --> D4
    D4 --> S2
    S1 --> S2 --> S3 --> S4
    S4 --> C1
    S4 --> C2
    S4 --> C3
    C1 --> SVC1
    C2 --> SVC1
    C3 --> SVC1
    SVC1 --> SVC2
    SVC2 --> SVC3
    SVC3 --> A1
    A1 --> A2

    style L1 fill:#1e3a5f,color:#fff
    style L2 fill:#1e3a3f,color:#fff
    style L3 fill:#3a1e3f,color:#fff
    style L4 fill:#3a3a1e,color:#fff
    style L5 fill:#1e3a1e,color:#fff
```

---

## 📁 核心项目

### 🏔️ rustfs + iceberg + restcatalog — 湖仓一体存储引擎
**定位：数据仓库基座，存算分离**

- **RustFS**：自研对象存储，为数据湖提供高可靠、低成本的存储底座
- **Iceberg**：开放表格式，支持 ACID、隐藏分区、时间旅行（Time Travel）
- **REST Catalog**：标准化的元数据服务接口，实现多引擎元数据统一

```
存算分离架构：
  计算层 (Spark/Flink/StarRocks)
       ↓ REST API
  REST Catalog (元数据服务)
       ↓
  Iceberg 表格式 (RustFS 对象存储)
```

---

### 📡 cyan-dataman — 数据采集 & 元数据平台
**定位：数据入湖 + 元数据治理中枢**

**📥 数据采集（CDC）**
- **MySQL Debezium** → **Kafka** → **Flink CDC** 实时数据捕获链路
- 支持增量同步、断点续传、Schema 变更自动适配

**🗃️ 元数据平台**
- **Gravitino + Iceberg + Spark** 构建统一元数据管理层
- **表结构管理**：字段类型、分区策略、版本演进
- **时间旅行（Time Travel）**：基于 Iceberg 快照实现历史数据回溯
- **关联关系图谱**：记录表之间的 JOIN 关系，为指标聚合提供图谱基础

```mermaid
flowchart LR
    A[MySQL] -->|Debezium| B[Kafka]
    B -->|Flink CDC| C[Iceberg Table]
    C -->|Gravitino| D[元数据服务]
    D --> E[表结构管理]
    D --> F[时间旅行]
    D --> G[关联关系图谱]
```

---

### 🌐 cyan-datagateway — 数据网关
**定位：统一 SQL 执行入口，资源调度中心**

- **多引擎统一入口**：将 StarRocks、Spark、Flink 封装为统一的 SQL 执行服务
- **智能路由**：根据 SQL 特征自动选择最优执行引擎
- **资源分配**：配额管理、队列调度、并发控制
- **SQL 解析增强**：权限拦截、SQL 改写、执行计划分析

```mermaid
flowchart LR
    User[用户/应用] --> Gateway[DataGateway]
    Gateway -->|OLAP 查询| A[StarRocks]
    Gateway -->|批处理| B[Spark]
    Gateway -->|流处理| C[Flink]
    Gateway --> D[资源调度器]
```

---

### 🔐 cyan-dataauth — 数据权限中心
**定位：细粒度数据安全管控**

- **表级权限**：控制用户对数据表的访问范围
- **行级权限**：基于条件过滤的行数据管控（如 `WHERE region='CN'`）
- **列级权限**：敏感字段脱敏与访问控制
- **权限申请流**：对外提供自助化权限申请、审批工作流
- **SQL 增强服务**：运行时注入权限条件，对上层透明

```mermaid
flowchart TD
    A[用户请求 SQL] --> B[DataAuth 解析]
    B --> C{权限校验}
    C -->|表级拒绝| D[返回无权限]
    C -->|行级过滤| E[注入 WHERE 条件]
    C -->|列级脱敏| F[替换敏感字段]
    E --> G[执行引擎]
    F --> G
```

---

### ⏱️ cyan-dataworks（规划中）— 调度系统 & 血缘治理
**定位：任务调度 + 数据血缘 + 质量保障**

- **任务调度**：Spark / Flink 作业的编排调度，支持依赖管理、失败重试
- **血缘追踪**：通过依赖表和版本号自动记录数据血缘链路
- **Agent 智能运维**：
  - 失败任务自动重跑
  - 告警原因智能梳理
  - 数据质量规则检测与报告

```mermaid
flowchart TD
    A[任务定义] --> B[依赖解析]
    B --> C[调度执行]
    C -->|成功| D[记录血缘: 表+版本号]
    C -->|失败| E[Agent 诊断]
    E --> F[自动重跑]
    E --> G[告警通知]
    D --> H[数据质量检测]
```

---

### 📈 cyan-datametric — 指标平台
**定位：数据应用的基石，指标维度管理中心**

- **指标维度定义**：统一管理原子指标、衍生指标、复合指标
- **DSL 查询语言**：面向业务人员的指标查询 DSL，屏蔽底层 SQL 复杂度
- **智能聚合**：基于元数据平台的**关联关系图谱**自动推导 JOIN 路径，实现跨表指标聚合
- **指标血缘**：追踪指标定义与数据源的依赖关系

```mermaid
flowchart LR
    A[业务人员] -->|DSL| B[指标平台]
    B --> C[指标定义]
    B --> D[维度选择]
    C --> E[关联关系图谱]
    D --> E
    E -->|自动推导 JOIN| F[生成 SQL]
    F --> G[DataGateway]
```

---

### 🤖 cyan-databi — 智能分析平台
**定位：可视化分析 + ChatBI**

- **图表构建**：基于指标平台的指标维度快速创建图表
- **ChatBI**：自然语言对话生成图表，降低数据分析门槛
- **看板编排**：以图表为原子单位，拖拽布局组成数据看板
- **实时刷新**：支持看板数据的定时刷新与实时推送

```mermaid
flowchart TD
    A[用户] -->|自然语言| B[ChatBI]
    A -->|拖拽配置| C[图表编辑器]
    B --> D[指标平台 DSL]
    C --> D
    D --> E[图表渲染]
    E --> F[看板布局]
    F --> G[数据看板]
```

---

## 🔄 数据流转全景

```mermaid
sequenceDiagram
    participant Source as MySQL
    participant CDC as Debezium+Kafka+Flink
    participant Lake as Iceberg+RustFS
    participant Meta as Gravitino
    participant Gateway as DataGateway
    participant Auth as DataAuth
    participant Metric as DataMetric
    participant BI as DataBI

    Source->>CDC: Binlog 变更事件
    CDC->>Lake: 实时写入 Iceberg
    Lake->>Meta: 注册元数据
    Meta->>Metric: 同步表结构&关系图谱

    BI->>Metric: DSL 查询请求
    Metric->>Meta: 查询关联关系
    Meta-->>Metric: 返回 JOIN 路径
    Metric->>Gateway: 生成 SQL
    Gateway->>Auth: 权限校验&改写
    Auth-->>Gateway: 返回增强 SQL
    Gateway->>Lake: 执行查询
    Lake-->>Gateway: 返回结果
    Gateway-->>Metric: 聚合数据
    Metric-->>BI: 图表数据
```

---

## 🛠️ 技术栈

### 数据湖 & 存储
<p>
  <img src="https://img.shields.io/badge/Apache%20Iceberg-7B42BC?style=flat-square&logo=apache&logoColor=white" alt="Iceberg" />
  <img src="https://img.shields.io/badge/Iceberg%20REST%20Catalog-6366F1?style=flat-square&logo=apache&logoColor=white" alt="REST Catalog" />
  <img src="https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
</p>

### 实时计算 & CDC
<p>
  <img src="https://img.shields.io/badge/Apache%20Flink-E6526F?style=flat-square&logo=apacheflink&logoColor=white" alt="Flink" />
  <img src="https://img.shields.io/badge/Apache%20Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white" alt="Kafka" />
  <img src="https://img.shields.io/badge/Debezium-F45C3E?style=flat-square&logo=debezium&logoColor=white" alt="Debezium" />
  <img src="https://img.shields.io/badge/Apache%20Spark-E25A1C?style=flat-square&logo=apachespark&logoColor=white" alt="Spark" />
  <img src="https://img.shields.io/badge/StarRocks-00B4D8?style=flat-square&logo=starrocks&logoColor=white" alt="StarRocks" />
</p>

### 元数据 & 治理
<p>
  <img src="https://img.shields.io/badge/Gravitino-FF6B6B?style=flat-square&logo=apache&logoColor=white" alt="Gravitino" />
  <img src="https://img.shields.io/badge/Open%20Lineage-6366F1?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIi8+PC9zdmc+&logoColor=white" alt="OpenLineage" />
</p>

### 后端 & 前端
<p>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Ant%20Design-0170FE?style=flat-square&logo=antdesign&logoColor=white" alt="Ant Design" />
</p>

### 基础设施
<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />
  <img src="https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux" />
  <img src="https://img.shields.io/badge/Apache%20Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white" alt="Maven" />
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />
</p>

---

## 📫 联系我

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-cyan--daimao-181717?style=for-the-badge&logo=github)](https://github.com/cyan-daimao)
&nbsp;
[![Portfolio](https://img.shields.io/badge/个人主页-cyan--daimao.github.io-6366F1?style=for-the-badge&logo=githubpages)](https://cyan-daimao.github.io)
&nbsp;
[![Gmail](https://img.shields.io/badge/Gmail-daimao2817@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:daimao2817@gmail.com)
&nbsp;
[![Email](https://img.shields.io/badge/163-a1624000875@163.com-FC3F00?style=for-the-badge&logo=mail.ru&logoColor=white)](mailto:a1624000875@163.com)

</div>

---

<div align="center">

<!-- 底部标语 -->
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=18&duration=4000&pause=1000&color=94A3B8&center=true&vCenter=true&width=650&lines=Data+is+the+new+oil%2C+but+refined+data+is+the+new+gold.;Lakehouse+is+not+the+future%2C+it+is+the+present.;From+raw+data+to+intelligent+insights." alt="Typing Quote" />

<br><br>

<img src="https://komarev.com/ghpvc/?username=cyan-daimao&color=6366F1&style=flat-square" alt="Profile Views" />

</div>
