___  ____                _____ _             _                   
|  \/  (_)              /  ___| |           | |                  
| .  . |_  ___ _ __ ___ \ `--.| |_ _ __ __ _| |_ ___  __ _ _   _ 
| |\/| | |/ __| '__/ _ \ `--. \ __| '__/ _` | __/ _ \/ _` | | | |
| |  | | | (__| | | (_) /\__/ / |_| | | (_| | ||  __/ (_| | |_| |
\_|  |_/_|\___|_|  \___/\____/ \__|_|  \__,_|\__\___|\__, |\__, |
                                                      __/ | __/ |
                                                     |___/ |___/ 
______ _        ______      _         ______       _             
| ___ (_)       |  _  \    | |        | ___ \     | |            
| |_/ /_  __ _  | | | |__ _| |_ __ _  | |_/ / ___ | |_           
| ___ \ |/ _` | | | | / _` | __/ _` | | ___ \/ _ \| __|          
| |_/ / | (_| | | |/ / (_| | || (_| | | |_/ / (_) | |_           
\____/|_|\__, | |___/ \__,_|\__\__,_| \____/ \___/ \__|          
          __/ |                                                  
         |___/                                                   
         
         

The MicroStrategy Big Data Bot is used to automate big data clusters.

This series of lambda functions pulls scheduling data for the big data clusters from a teamup user interface.
The ingestion of this data is achieved using the teamup rest API.

BigDataCron
- constantly polls teamup for scheduling updates
- tranforms the ingested data and passes this to the orchestrator

BigDataOrchestrator
- consumes the scheduling data from the BigDataCron
- parses out the cluster information
- starts / stops the clusters accordingly
- handles multiple differen't clusters with different start criteria

