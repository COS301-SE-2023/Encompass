# Architecture Documentation

## Design Strategy:
Based on quality requirements and decomposition.

## Quality requirements:
Based on determined quality requirements and chosen architectures are a reflection of what the system needs to accomplish these requirements. These include quality attributes and non-functional requirements like scalability, usability, security, reliability, and maintainability.

## Decomposition:
Based on taking a monolithic system and breaking it into smaller components, breaking the complex system into more manageable subsystems, helping with understandability and maintainability.

## Architectural Patterns:
- Event Driven (Pub-sub)
- Monolithic - with CQRS
- Multitier + client-server
- Model-view-controller

### Event-Driven Architecture
Very similar to publish-subscribe architecture.
Previous documentation: The publish-subscribe architecture, also known as the event-driven architecture, allows Encompass users to subscribe to specific communities of interest. When a client publishes a message to a channel, all subscribed clients receive the message. This pattern facilitates real-time communication and enables the creation of chat rooms or group conversations.
- Asynchronous messages need to be sent by the client to the backend to trigger events and response actions.
- Event: a significant change in state
- What is produced, published, propagated, detected, or consumed is a (typically asynchronous) message called the event notification, and not the event itself, which is the state change that triggered the message emission.
- Simplifies horizontal scalability in distributed computing models.
- More resilient to failure.
- Emitters have the responsibility to detect, gather, and transfer events.
- Event channels are conduits in which events are transmitted from event emitters to event consumers.
- Good for real-time.

(describe what is happening within the application)
(provide diagram)

Start of Official Documentation:

The event-driven architecture used within Encompass is essential to mapping out the application’s real-time functionality. This is particularly important considering the need for real time updates on posts, messaging, notifications, as well as the recommendation aspect of the content.

The user establishes a new connection with the websocket API, which sends the user actions or commands to the interface, which then transforms the user input into command messages. These command messages are sent to the Message broker, which acts as the central communication hub for the event-driven architecture, which then routes these commands to the appropriate application service.

Once these commands are routed to their service, they are passed to their respective event handler, which validates the command, executes the business logic of the command, and updates the system’s state. Those generated events then get passed back to the message broker. The message broker then sends the notifier those published events, which in turn delivers them to the websocket.

The respective database (either key/value pair or media, depending on the nature of the event) gets updated based on the processed events, and returns relevant data for any queries.


### Monolithic
All the components and modules of the system are tightly coupled and deployed together. This is used in combination with CQRS to divide the commands (write operations) and the queries (read operations).
- Self-contained and independent but lacks flexibility, thus implementation of multi-tier and adding CQRS.

Previous doc:
The Encompass application incorporates the CQRS pattern to separate the responsibilities of commands (write operations) and queries (read operations) for improved scalability and performance. Key aspects of CQRS include:

Commands:
- Responsible for modifying the state of the chat system.
- Processes message sending, user authentication, and other write operations.
- Writes events to the event store.

Queries:
- Responsible for retrieving data from the chat system.
- Handles message retrieval, user profile display, and other read operations.
- Reads events from the event store and generates query-specific views.

Event Store:
- Stores all events representing state changes in the chat system.
- Maintains an append-only log of events for auditing and rebuilding the system's state.
- Provides event sourcing capabilities.

**We are not using an event store.

(describe what is happening within the application)
(provide diagram)

### Multi-Tier
- Introduces flexibility and reusability.
- Add or remove tiers instead of reworking the entire system - modularity.
- We will be using a 3-tier architecture.
- This architecture has similarities to the client-server architecture, and it will be briefly discussed in terms of similarity, but it will not make an appearance as a chosen architecture.
Similarities:
- Divide system functionality into distinct components.
- Scalability.
- Modularity, maintenance.
- Security between components (tiers).

Previous doc:
The multi-tier architecture divides the Encompass application into three distinct tiers: the presentation tier, the application/business logic tier, and the data/storage tier. This separation enables modular development, scalability, and ease of maintenance.

#### Presentation Tier
The presentation tier is responsible for handling user interactions and displaying the app interface. It includes components such as the user interface (UI) and the client-side application logic.

#### Application/Business Logic Tier
The application/business logic tier contains the core logic of the Encompass application. It handles user authentication, message processing, AI, and business rules. This tier communicates with the presentation tier and the data/storage tier.

#### Data/Storage Tier
The data/storage tier handles the persistence and retrieval of relevant data to the Encompass app user.

(describe what is happening within the application)
(provide diagram)

### Model-View-Controller
Separates the application logic into three interconnected components:

#### Model
The Model represents the data and business logic of the application. It encapsulates the data and defines how it can be accessed, modified, or manipulated. The Model component is responsible for maintaining the integrity and consistency of the data.

#### View
The View represents the presentation layer of the application. It is responsible for displaying the data to the user and providing an interface for user interaction. The View receives data from the Model and presents it in a visually understandable format. It also sends user input or actions to the Controller.

#### Controller
The Controller acts as an intermediary between the Model and the View. It receives user input or actions from the View, processes them, and interacts with the Model accordingly. The Controller updates the Model based on user actions and retrieves data from the Model to update the View. It manages the flow of data and controls the overall behavior of the application.

The model is responsible for managing the data of the application. It receives user input from the controller.
The view renders the presentation of the model in a particular format.
The controller responds to the user input and performs interactions on the data model objects. The controller receives the input, optionally validates it, and then passes the input to the model.

- Easier maintenance, extensibility, and reusability.
- Promotes loose coupling.
- Each component has its own core functionality independent of other components.
- Separates how the information is presented vs. how the information is accepted from the user.
- Independence of presentation and data, e.g., multiple views on one model simultaneously,
- Composable presentation widgets, e.g., one view used as a subview of another,
- Switchable input modes, by swapping one controller out for another during runtime, and
- Independence of input and output processing, via the separate responsibilities of controllers and views.

(describe what is happening within the application)
(provide diagram)

## Architectural Quality Requirements
- Performance
- Scalability
- Security
- Reliability
- Maintainability
- Customizability*
- Efficiency*
- Responsiveness*

**These need to be quantifiable

## Architectural Design & Pattern
**Describe how each architectural pattern fits together.
**Show the complete diagram.
**Justify in combo with constraints.

## Architectural Constraints
- Data protection/security standards
- Performance - needs to be able to be responsive and handle many requests
- Budget - API requests (as well as API integration)
- Availability and scalability
- Data storage - large amounts of user-generated data
- Real-time updates
- Data collection

## Technology Choices
- CQRS
- Ionic Angular
- NX
- AWS + MongoDB

Overview
Pros/Cons
Why it fits with the architecture designs/patterns
