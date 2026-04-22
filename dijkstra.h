#pragma once

#include <tuple>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <queue>

//A class for reverse Dijkstra flow fields. It takes a graph and calculates the shortest paths of any source to all of its regional nodes.
//This is a version which calculates paths in tandem, so calculation time is theoretically minimal at approximately O(V*logV+E).
//Meant to be used in tandem with tilesets. To that extent, the weight and passibility of each group of tiles (same source ID) can be modified via subgraphValuate().
//The exact region to be explored is also adjustable when calling the flow field.
class Dijkstra {
    public:
        Dijkstra();
        void vertex(const int, const int = -1);
        void edge(const int, const int, const bool = false);
        void mask(const int, const int);
        void subgraphValuate(const int, const bool, const int);
        std::unordered_map<int,std::vector<int>> flow(const int, const int);

    private:
        //void flow(const std::pair<int,int>, std::priority_queue<std::pair<int,int>>&);
        std::unordered_map<int, std::tuple<std::unordered_set<int>,int,int>> edgeHM;
        //std::unordered_map<int, std::array<int, 2>> vertexHM;
        std::unordered_map<int, std::tuple<bool,int>> subgraphHM;
        //std::unordered_map<int, std::tuple<bool, int>> subgraphPropHM;
};
