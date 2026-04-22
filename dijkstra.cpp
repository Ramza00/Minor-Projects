#include "dijkstra.h"

void Dijkstra::_bind_methods() {
    godot::ClassDB::bind_method(godot::D_METHOD("vertex","node","subgraph"), &Dijkstra::vertex, DEFVAL(-1));
    godot::ClassDB::bind_method(godot::D_METHOD("edge","a","b","bidirectional"), &Dijkstra::edge, DEFVAL(true));
    godot::ClassDB::bind_method(godot::D_METHOD("mask","node","weight"), &Dijkstra::mask);
    godot::ClassDB::bind_method(godot::D_METHOD("subgraphValuate","subgraph","reachable", "weight"), &Dijkstra::subgraphValuate);
    godot::ClassDB::bind_method(godot::D_METHOD("flow","strength","origin"), &Dijkstra::flow);
}

//should have another var in edgeHM for masking
Dijkstra::Dijkstra(){
    edgeHM = std::unordered_map<int, std::tuple<std::unordered_set<int>,int,int>>{}; // collection of node id : (neighbors, node type, mask)
    subgraphHM = std::unordered_map<int, std::tuple<bool,int>>{}; //collection of note type :  properties (can reach, weight)
}

void Dijkstra::vertex(const int node, const int subgraph){
    edgeHM[node] = std::tuple<std::unordered_set<int>,int,int>{{},subgraph,0}; //node : connections & node type & mask weight
    subgraphHM.try_emplace(subgraph, std::tuple<bool,int>{true, 1}); //node type : properties of the node type
}

void Dijkstra::edge(const int a, const int b, bool bidirectional){
    if(edgeHM.find(a) != edgeHM.end()) std::get<0>(edgeHM[a]).insert(b);
    if(bidirectional && edgeHM.find(b) != edgeHM.end()) std::get<0>(edgeHM[b]).insert(a);
}

void Dijkstra::mask(const int node, const int weight){
    std::get<2>(edgeHM[node]) = weight;
}

void Dijkstra::subgraphValuate(const int subgraph, const bool reachable, const int weight){
    std::get<0>(subgraphHM[subgraph]) = reachable;
    std::get<1>(subgraphHM[subgraph]) = weight;
}

//return all traversable nodes as keys with paths as values
godot::Dictionary Dijkstra::flow(const int strength, const int origin){
    std::priority_queue<std::pair<int,int>> pq; // strength, node
    std::unordered_map<int,std::pair<int,std::vector<int>>> visited; //node : (strength, node path)
    std::pair<int,int> strengthOrigin; //formatting for priority queue
    pq.push(std::pair<int,int>(strength,origin));
    visited[origin] = std::pair<int,std::vector<int>>(strength,{origin}); //init the visited
    while(!pq.empty()){
        //begin the next iteration based on the highest strength node
        strengthOrigin = pq.top();
        pq.pop();
        //get edge nodes
        std::unordered_set<int> neighbors = std::get<0>(edgeHM[std::get<1>(strengthOrigin)]);   
        //for each edge node
        for(const int& neighbor : neighbors){
            std::tuple<bool,int> properties = subgraphHM[std::get<1>(edgeHM[neighbor])]; //get the properties for the neighbor
            if(!std::get<0>(properties)) continue; //pass if unreachable
            int dStrength = std::get<0>(strengthOrigin)-(std::get<1>(properties)+std::get<2>(edgeHM[neighbor])); //strength after traversing
            if(dStrength < 0 || visited.find(neighbor) != visited.end() && dStrength <= std::get<0>(visited[neighbor])) continue; //pass if cost too high or is higher than what has already been found
            pq.push(std::pair<int,int>(dStrength,neighbor));
            //copy the node path, add the current node, and assign it to the visited map
            std::vector<int> path = std::get<1>(visited[std::get<1>(strengthOrigin)]);
            path.push_back(neighbor);
            visited[neighbor] = std::pair<int,std::vector<int>>(dStrength, path);
        }
    }
    //destination node, path
    // std::unordered_map<int,std::vector<int>> returnMap;
    // returnMap.reserve(visited.size());
    // for(auto& [key, pairVal]: visited){
    //     returnMap[key] = std::move(pairVal.second);
    // }
    //return returnMap;

    godot::Dictionary returnMap;
    for(auto& [key, pairVal]: visited){
        godot::PackedInt32Array t = {};
        for(int& j : pairVal.second){
            t.append(j);
        }
        returnMap[key] = t;
    }
    return returnMap;
}

//should return the furthest node one can reach with given strength first
//currently fails due to no storing of the best path for any node and failure to return anything

// void Dijkstra::flow(const std::pair<int,int> strengthOrigin, std::priority_queue<std::pair<int,int>>& pq){
//     std::unordered_set<int> neighbors = std::get<0>(edgeHM[std::get<1>(strengthOrigin)]);
//     //for each starting neighbor, find remaining strength of travel
//     for (auto& itr : neighbors){
//        std::tuple<bool,int> properties = subgraphHM[std::get<1>(edgeHM[itr])]; //get the properties
//        if(!std::get<0>(properties)) continue; //pass if unreachable
//        int dStrength = std::get<1>(strengthOrigin)-std::get<1>(properties); //strength after traversing
//        if(dStrength < 0) continue;
//        pq.push(std::pair<int,int>(dStrength,itr));
//     }
//     //begin the next recursion based on the highest strength node
//     std::pair<int,int> next = pq.top();
//     pq.pop();
//     Dijkstra::flow(next, pq);
// }