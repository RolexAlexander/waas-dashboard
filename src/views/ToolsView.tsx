import React from 'react';
import { demos } from '../demos';
import { useWaaSStore } from '../store/waasStore';
import { Search, Settings, Wrench, Database, MessageSquare, BarChart3, Globe, FileText, Code, Zap } from 'lucide-react';

// Helper function to extract all tools from demo organizations
const extractToolsFromDemos = () => {
  const toolsSet = new Set<string>();
  const toolDetails: Record<string, any> = {};

  Object.values(demos).forEach(demo => {
    demo.environments.forEach(env => {
      env.tools.forEach(toolName => {
        toolsSet.add(toolName);
        if (!toolDetails[toolName]) {
          toolDetails[toolName] = {
            name: toolName,
            category: getToolCategory(toolName),
            description: getToolDescription(toolName),
            icon: getToolIcon(toolName),
            usedInOrgs: [],
            environments: []
          };
        }
        
        if (!toolDetails[toolName].usedInOrgs.includes(demo.name)) {
          toolDetails[toolName].usedInOrgs.push(demo.name);
        }
        
        if (!toolDetails[toolName].environments.includes(env.id)) {
          toolDetails[toolName].environments.push(env.id);
        }
      });
    });
  });

  return Array.from(toolsSet).map(toolName => toolDetails[toolName]);
};

// Helper functions to categorize and describe tools
const getToolCategory = (toolName: string): string => {
  const categories: Record<string, string> = {
    'web_search': 'research',
    'create_report': 'productivity',
    'list_reports': 'productivity',
    'get_report_details': 'productivity',
    'update_report_section': 'productivity',
    'analyze_data': 'analysis',
    'summarize_findings': 'analysis',
    'human_input_research': 'collaboration',
    'start_conversation': 'communication',
    'create_story_outline': 'content',
    'write_chapter': 'content',
    'create_illustrations': 'creative',
    'publish_book': 'publishing',
    'list_books': 'content',
    'get_book_details': 'content',
    'delete_book': 'content',
    'plan_feature': 'development',
    'list_files': 'development',
    'read_file_content': 'development',
    'write_code': 'development',
    'create_pull_request': 'development',
    'run_tests': 'testing',
    'merge_pr': 'development',
    'get_campaign_brief': 'marketing',
    'develop_ad_concept': 'creative',
    'create_ad_copy': 'content',
    'design_visuals': 'creative',
    'list_articles': 'content',
    'get_article_content': 'content',
    'write_article': 'content',
    'edit_article': 'content',
    'publish_article': 'publishing',
    'delete_article': 'content'
  };
  
  return categories[toolName] || 'utility';
};

const getToolDescription = (toolName: string): string => {
  const descriptions: Record<string, string> = {
    'web_search': 'Search the web for information and research',
    'create_report': 'Generate comprehensive reports and documentation',
    'list_reports': 'View and manage existing reports',
    'get_report_details': 'Retrieve detailed information about specific reports',
    'update_report_section': 'Modify and update sections of existing reports',
    'analyze_data': 'Perform data analysis and extract insights',
    'summarize_findings': 'Create summaries of research findings and data',
    'human_input_research': 'Request input and feedback from human experts',
    'start_conversation': 'Initiate collaborative discussions between agents',
    'create_story_outline': 'Develop structured outlines for creative content',
    'write_chapter': 'Generate written content for books and stories',
    'create_illustrations': 'Generate visual content and illustrations',
    'publish_book': 'Finalize and publish completed books',
    'list_books': 'View and manage book collections',
    'get_book_details': 'Retrieve information about specific books',
    'delete_book': 'Remove books from the collection',
    'plan_feature': 'Create technical specifications for software features',
    'list_files': 'Browse and manage code repositories',
    'read_file_content': 'Access and review file contents',
    'write_code': 'Create and modify source code',
    'create_pull_request': 'Submit code changes for review',
    'run_tests': 'Execute automated testing procedures',
    'merge_pr': 'Integrate approved code changes',
    'get_campaign_brief': 'Access marketing campaign information',
    'develop_ad_concept': 'Create advertising concepts and strategies',
    'create_ad_copy': 'Write compelling marketing copy',
    'design_visuals': 'Create visual marketing materials',
    'list_articles': 'Manage article collections',
    'get_article_content': 'Access article content and metadata',
    'write_article': 'Create new articles and blog posts',
    'edit_article': 'Modify and improve existing articles',
    'publish_article': 'Make articles available to readers',
    'delete_article': 'Remove articles from publication'
  };
  
  return descriptions[toolName] || 'Utility tool for various tasks';
};

const getToolIcon = (toolName: string): React.ReactNode => {
  const icons: Record<string, React.ReactNode> = {
    'web_search': <Globe className="w-5 h-5" />,
    'create_report': <FileText className="w-5 h-5" />,
    'list_reports': <FileText className="w-5 h-5" />,
    'get_report_details': <FileText className="w-5 h-5" />,
    'update_report_section': <FileText className="w-5 h-5" />,
    'analyze_data': <BarChart3 className="w-5 h-5" />,
    'summarize_findings': <BarChart3 className="w-5 h-5" />,
    'human_input_research': <MessageSquare className="w-5 h-5" />,
    'start_conversation': <MessageSquare className="w-5 h-5" />,
    'create_story_outline': <FileText className="w-5 h-5" />,
    'write_chapter': <FileText className="w-5 h-5" />,
    'create_illustrations': <Zap className="w-5 h-5" />,
    'publish_book': <FileText className="w-5 h-5" />,
    'list_books': <FileText className="w-5 h-5" />,
    'get_book_details': <FileText className="w-5 h-5" />,
    'delete_book': <FileText className="w-5 h-5" />,
    'plan_feature': <Code className="w-5 h-5" />,
    'list_files': <Code className="w-5 h-5" />,
    'read_file_content': <Code className="w-5 h-5" />,
    'write_code': <Code className="w-5 h-5" />,
    'create_pull_request': <Code className="w-5 h-5" />,
    'run_tests': <Settings className="w-5 h-5" />,
    'merge_pr': <Code className="w-5 h-5" />,
    'get_campaign_brief': <FileText className="w-5 h-5" />,
    'develop_ad_concept': <Zap className="w-5 h-5" />,
    'create_ad_copy': <FileText className="w-5 h-5" />,
    'design_visuals': <Zap className="w-5 h-5" />,
    'list_articles': <FileText className="w-5 h-5" />,
    'get_article_content': <FileText className="w-5 h-5" />,
    'write_article': <FileText className="w-5 h-5" />,
    'edit_article': <FileText className="w-5 h-5" />,
    'publish_article': <FileText className="w-5 h-5" />,
    'delete_article': <FileText className="w-5 h-5" />
  };
  
  return icons[toolName] || <Wrench className="w-5 h-5" />;
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'research': 'bg-blue-100',
    'productivity': 'bg-green-100',
    'analysis': 'bg-purple-100',
    'collaboration': 'bg-yellow-100',
    'communication': 'bg-pink-100',
    'content': 'bg-indigo-100',
    'creative': 'bg-orange-100',
    'publishing': 'bg-teal-100',
    'development': 'bg-gray-100',
    'testing': 'bg-red-100',
    'marketing': 'bg-cyan-100',
    'utility': 'bg-slate-100'
  };
  
  return colors[category] || 'bg-gray-100';
};

export function ToolsView() {
  const [activeTab, setActiveTab] = React.useState('all-tools');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedTool, setSelectedTool] = React.useState<any>(null);

  const { getAllOrganizations } = useWaaSStore();
  const organizations = getAllOrganizations();

  // Get all tools from demos
  const allTools = React.useMemo(() => {
    return extractToolsFromDemos();
  }, []);

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(allTools.map(tool => tool.category));
    return Array.from(cats).sort();
  }, [allTools]);

  // Filter tools
  const filteredTools = React.useMemo(() => {
    return allTools.filter(tool => {
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [allTools, searchQuery, selectedCategory]);

  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#0d141c] tracking-light text-[32px] font-bold leading-tight">Tools</p>
            <p className="text-[#49739c] text-sm font-normal leading-normal">
              Explore all available tools across your organizations
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#cedbe8] px-4">
          {[
            { id: 'all-tools', label: 'All Tools' },
            { id: 'by-category', label: 'By Category' },
            { id: 'by-organization', label: 'By Organization' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#0c7ff2] text-[#0c7ff2]'
                  : 'border-transparent text-[#49739c] hover:text-[#0d141c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 border-b border-[#cedbe8]">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Tool List */}
        <div className="p-4">
          {!selectedTool ? (
            <>
              {activeTab === 'all-tools' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
                    <div 
                      key={tool.name} 
                      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedTool(tool)}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-lg ${getCategoryColor(tool.category)} flex items-center justify-center`}>
                            {tool.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{tool.name}</h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {tool.category}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tool.description}</p>
                        
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Used in:</span> {tool.usedInOrgs.length} organization{tool.usedInOrgs.length > 1 ? 's' : ''}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tool.usedInOrgs.slice(0, 2).map((org: string) => (
                              <span key={org} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-50 text-blue-700">
                                {org}
                              </span>
                            ))}
                            {tool.usedInOrgs.length > 2 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-50 text-gray-600">
                                +{tool.usedInOrgs.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'by-category' && (
                <div className="space-y-6">
                  {categories.map(category => {
                    const categoryTools = filteredTools.filter(tool => tool.category === category);
                    if (categoryTools.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                          {category} ({categoryTools.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryTools.map((tool) => (
                            <div 
                              key={tool.name} 
                              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer"
                              onClick={() => setSelectedTool(tool)}
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className={`w-10 h-10 rounded-lg ${getCategoryColor(tool.category)} flex items-center justify-center`}>
                                    {tool.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900">{tool.name}</h4>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{tool.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'by-organization' && (
                <div className="space-y-6">
                  {Object.values(demos).map(demo => {
                    const orgTools = new Set<string>();
                    demo.environments.forEach(env => {
                      env.tools.forEach(tool => orgTools.add(tool));
                    });
                    
                    const toolList = Array.from(orgTools).map(toolName => 
                      allTools.find(t => t.name === toolName)
                    ).filter(Boolean);
                    
                    return (
                      <div key={demo.name}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {demo.name} ({toolList.length} tools)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                          {toolList.map((tool: any) => (
                            <div 
                              key={tool.name} 
                              className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer p-3"
                              onClick={() => setSelectedTool(tool)}
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded ${getCategoryColor(tool.category)} flex items-center justify-center`}>
                                  {React.cloneElement(tool.icon as React.ReactElement, { className: 'w-4 h-4' })}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">{tool.name}</h4>
                                  <p className="text-xs text-gray-500 capitalize">{tool.category}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            /* Tool Details View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Tools
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-lg ${getCategoryColor(selectedTool.category)} flex items-center justify-center`}>
                    {React.cloneElement(selectedTool.icon as React.ReactElement, { className: 'w-8 h-8' })}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedTool.name}</h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {selectedTool.category}
                    </span>
                    <p className="text-gray-600 mt-3">{selectedTool.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Used in Organizations</h3>
                    <div className="space-y-2">
                      {selectedTool.usedInOrgs.map((org: string) => (
                        <div key={org} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Database className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900">{org}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available in Environments</h3>
                    <div className="space-y-2">
                      {selectedTool.environments.map((env: string) => (
                        <div key={env} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-900">{env}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-500">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No tools are available in the current organizations'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}